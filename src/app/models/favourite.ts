import { Meal } from './meal';

export interface Favourite {
    id?: number;
    user_id: number;
    meal_id: string;
    meal_data: Meal;
}