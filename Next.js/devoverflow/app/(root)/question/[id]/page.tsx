import NoResults from "@/components/shared/NoResults";
import ParseHTML from "@/components/shared/ParseHTML";
import Votes from "@/components/shared/Votes";
import AnswerForm from "@/components/forms/AnswerForm";
import RenderTag from "@/components/ui/RenderTag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AnswerFilters } from "@/constants/filters";
import { IAnswer } from "@/database/answer.model";
import { getAnswers } from "@/lib/actions/answer.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { formatAndDivideNumber, getTimeStamp } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import EditDeleteAction from "@/components/shared/EditDeleteAction";
import Filter from "@/components/shared/Filter";
import Pagination from "@/components/shared/Pagination";

interface Props {
  params: { id: string };
  searchParams: { [key: string]: string | undefined };
}

const Page = async ({ params, searchParams }: Props) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getUserById(userId);

  const question = await getQuestionById(params.id);

  const result = await getAnswers({
    questionId: params.id,
    filter: searchParams.filter!,
    page: searchParams.page ? +searchParams.page : 1,
  });

  return (
    <div className="flex flex-col gap-10">
      {/* HEAD SECTION */}
      <div className="flex justify-between gap-10">
        <Link
          href={`/profile/${question.author.clerkId}`}
          className="flex justify-center items-center gap-2"
        >
          <Image
            src={question.author.picture}
            alt="author"
            height={30}
            width={30}
            className="rounded-full"
          />
          <p className="text-xl font-semibold">{question.author.name}</p>
        </Link>

        <Votes
          user={JSON.stringify(user)}
          question={JSON.stringify(question)}
        />
      </div>

      {/* QUESTION DETAILS */}

      <div className="flex flex-col gap-6">
        {/* question heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">{question.title}</h1>
          <div className="flex justify-start items-center gap-2">
            <div className="flex justify-center items-center gap-1">
              <Image
                src={"/assets/icons/clock.svg"}
                alt="clock"
                height={18}
                width={18}
              />
              <p className="text-xs text-center">{`Asked ${getTimeStamp(
                question.createdAt
              )}`}</p>
            </div>
            <div className="flex justify-center items-center gap-1">
              <Image
                src={"/assets/icons/message.svg"}
                alt="message"
                height={18}
                width={18}
              />
              <p className="text-xs text-center">{`${formatAndDivideNumber(
                question.answers.length
              )} Answers`}</p>
            </div>
            <div className="flex justify-center items-center gap-1">
              <Image
                src={"/assets/icons/eye.svg"}
                alt="eye"
                height={18}
                width={18}
              />
              <p className="text-xs text-center">{`${formatAndDivideNumber(
                question.views
              )} Views`}</p>
            </div>
          </div>
        </div>

        {/* question content */}
        <ParseHTML data={question.content} />

        {/* question tags */}
        <div className="flex gap-2">
          {question.tags.map((tag: any) => {
            return <RenderTag key={tag._id} _id={tag._id} name={tag.name} />;
          })}
        </div>
      </div>

      <Separator />

      {/* ANSWER AND FILTER */}
      <div className="flex justify-between items-center">
        <p className="text-primary">{`${formatAndDivideNumber(
          question.answers.length
        )} Answers`}</p>
        <Filter filter={AnswerFilters} />
      </div>

      {/* ANSWERS */}
      <div>
        {result.answers.length > 0 ? (
          result.answers.map((ans) => {
            const showDeleteAction =
              ans.author._id.toString() === user._id.toString();

            return (
              <div key={ans._id} className="flex flex-col gap-5">
                <div className="flex justify-between">
                  <div className="flex justify-center items-center gap-2 max-sm:flex-col">
                    <Link
                      href={`/profile/${ans.author.clerkId}`}
                      className="flex justify-center items-center gap-2"
                    >
                      <Image
                        src={ans.author.picture}
                        alt="author"
                        height={24}
                        width={24}
                        className="rounded-full"
                      />
                      <p className="text-lg font-semibold">{ans.author.name}</p>
                    </Link>
                    <p className="text-xs">{`Answered ${getTimeStamp(
                      ans.createdAt
                    )}`}</p>
                  </div>

                  <div className="flex gap-10 max-sm:flex-col-reverse max-sm:items-center max-sm:gap-2">
                    <Votes
                      user={JSON.stringify(user)}
                      answer={JSON.stringify(ans)}
                    />

                    {showDeleteAction && (
                      <EditDeleteAction
                        type={"answer"}
                        Id={JSON.stringify(ans._id)}
                      />
                    )}
                  </div>
                </div>

                <ParseHTML data={ans.content} />

                <Separator className="mb-7" />
              </div>
            );
          })
        ) : (
          <NoResults title="No answers yet..!!" desc="" />
        )}

        <div>
          <Pagination
            page={searchParams.page ? +searchParams.page : 1}
            isNext={result.isNext}
          />
        </div>
      </div>

      {/* ANSWER FORM */}
      <AnswerForm
        userId={JSON.stringify(user._id)}
        questionId={JSON.stringify(question._id)}
      />
    </div>
  );
};

export default Page;
