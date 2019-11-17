import { Answer } from "./Answer";

export class QnA {
    id: number;
    text: string;
    upvotes: number;
    downvotes: number;
    answers: Array<Answer>
}
