"use server"

import User, { IUser } from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import { notFound, redirect } from "next/navigation";
import { FilterQuery } from "mongoose";

export interface CreateUserParams {
    clerkId: string;
    name: string;
    username: string;
    email: string;
    picture: string;
}

export async function createUser(userData: CreateUserParams) {
    try {
        await connectToDatabase();

        const user = await User.create(userData);

        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getAllUsers(searchQuery: string, filter: string, page = 1, pageSize = 9) {
    try {
        await connectToDatabase();

        const query: FilterQuery<typeof User> = {};

        if (searchQuery) {
            query.$or = [
                { name: { $regex: new RegExp(searchQuery, "i") } },
                { username: { $regex: new RegExp(searchQuery, "i") } }
            ]
        }

        let sortOptions = {}

        switch (filter) {
            case "new_users":
                sortOptions = { joinedAt: -1 }
                break;
            case "old_users":
                sortOptions = { joinedAt: 1 }
                break;
            case "top_contributors":
                sortOptions = { reputation: -1 }
                break;
        }

        const skipAmount = (page - 1) * pageSize;

        const users = await User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);

        const totalUsers = await User.countDocuments(query);

        const isNext = skipAmount + pageSize < totalUsers;

        return { users, isNext };

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserById(userId: string) {
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            throw new Error("No user found")
        }

        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export interface UpdateUserParams {
    clerkId: string;
    updateData: Partial<IUser>;
    path: string;
}

export async function updateUser(params: UpdateUserParams) {

    try {
        await connectToDatabase();

        await User.findOneAndUpdate({ "clerkId": params.clerkId }, params.updateData);

        revalidatePath(params.path);
    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function deleteUser(userId: string) {
    try {
        await connectToDatabase();

        const user = await User.findOneAndDelete({ "clerkId": userId })

        if (!user) {
            throw new Error("No user found");
        }

        // Delete user from database
        // and questions, answers, comments, etc.

        await Question.deleteMany({ "author": user._id })

        return user;

    } catch (error) {
        console.log(error);
        throw error;
    }
}

export interface SaveQuestionParams {
    userId: string,
    questionId: string,
    path: string
}

export async function saveQuestion(params: SaveQuestionParams) {

    try {

        connectToDatabase();

        const user = await User.findById(params.userId);

        if (!user) {
            throw new Error("No user found")
        }

        const question = await Question.findById(params.questionId);

        if (!question) {
            throw new Error("No question found")
        }

        const savedQuestion = user.saved.includes(params.questionId);

        if (savedQuestion) {
            user.saved.pull(params.questionId);
        }
        else {
            user.saved.push(params.questionId);
        }

        await user.save();

        revalidatePath(params.path);

    } catch (error) {
        console.log(error);
        throw error;
    }

}

export async function getSavedQuestions(userId: string, searchQuery: string, filter: string, page = 1, pageSize = 20) {

    try {

        connectToDatabase();

        const query: FilterQuery<typeof Question> = {};

        if (searchQuery) {
            query.$or = [
                { title: { $regex: new RegExp(searchQuery, "i") } },
                { content: { $regex: new RegExp(searchQuery, "i") } }
            ]
        }

        let sortOptions = {};

        switch (filter) {
            case "most_recent":
                sortOptions = { createdAt: -1 }
                break;
            case "oldest":
                sortOptions = { createdAt: 1 }
                break;
            case "most_voted":
                sortOptions = { upvotes: -1 }
                break;
            case "most_viewed":
                sortOptions = { views: -1 }
                break;
            case "most_answered":
                sortOptions = { answers: -1 }
                break;
        }

        const skipAmount = (page - 1) * pageSize;

        const user = await User.findOne({ "clerkId": userId }).populate({
            path: 'saved',
            match: query,
            options: {
                sort: sortOptions,
                skip: skipAmount,
                limit: pageSize + 1
            },
            populate: [
                { path: 'tags', select: "_id name" },
                { path: 'author', select: '_id clerkId name picture' }
            ]
        })

        const isNext = user.saved.length > pageSize;

        return { questions: user.saved, isNext };

    } catch (error) {
        console.log(error);
        throw error;
    }

}