import { EventEmitter, Injectable } from "@angular/core";
import { Recipe } from "./recipes/recipe.model";
import { Ingredient } from "./shared/ingredient.model";
import { ShoppingListService } from './shoppilg-list.service';

@Injectable()
export class RecipeService {

    constructor(private shoppingListService: ShoppingListService) { }

    recipeSelected = new EventEmitter<Recipe>();

    private recipes: Recipe[] = [
        new Recipe(
            "Butter Chiken",
            "Butter chiken by chef Ranveer",
            "https://www.licious.in/blog/wp-content/uploads/2020/10/butter-chicken-.jpg",
            [
                new Ingredient("Chiken", 1),
                new Ingredient("Onion", 1)
            ]),
        new Recipe(
            "Butter Panner",
            "The best Butter Panner you will ever taste",
            "https://i2.wp.com/fforflavour.com/wp-content/uploads/2018/07/IMG_5518.jpg?w=1140&ssl=1",
            [
                new Ingredient("Panner", 1),
                new Ingredient("Onion", 1)
            ])
    ]

    getRecipes() {
        return this.recipes;
    }

    getRecipe(index: number) {
        return this.recipes[index];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
    }

}