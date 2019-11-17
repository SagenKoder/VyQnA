import {Component, OnInit} from "@angular/core";
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import "rxjs/add/operator/map";
import { Headers } from "@angular/http";
import { QnA } from "./QnA";
import { Answer } from "./Answer";

@Component({
    selector: "min-app",
    templateUrl: "SPA.html"
})

export class SPA {
    showQuestionForm: boolean;
    showAnswerForm: boolean;
    showQnAList: boolean;

    loading: boolean;

    questionForm: FormGroup;
    answerForm: FormGroup;

    allQnA: Array<QnA>;
    
    constructor(private _http: Http, private fb: FormBuilder) {
        this.questionForm = this.fb.group({
            questionText: new FormControl(null, Validators.compose([
                Validators.required,
                Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!\n\r<>]{5,500}")
            ]))
        });

        this.answerForm = this.fb.group({
            questionId: [""],
            answerText: new FormControl(null, Validators.compose([
                Validators.required,
                Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!\n\r<>]{5,5000}")
            ]))
        });
    }
    
    ngOnInit() {
        this.loading = true;
        this.fetchAllQuestions();
        this.showQuestionForm = false;
        this.showAnswerForm = false;
        this.showQnAList = true;
    }

    showList() {
        this.showQnAList = true;
        this.showQuestionForm = false;
        this.showAnswerForm = false;
    }

    fetchAllQuestions() {
        this._http.get("api/QnA/")
            .subscribe(JsonData => {
                this.allQnA = [];
                if (JsonData) {
                    this.loading = false;
                    for (let obj of JsonData.json()) {
                        this.allQnA.push(obj);
                        console.log(obj);
                    }
                    this.allQnA = this.allQnA.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)); // sort reverse order by sum of votes
                };
            },
            error => alert(error),
            () => console.log("Finished fetching all data, got " + this.allQnA.length + " questions!")
        );
    };

    upvoteQuestion(id: number) {
        // increment immediately and update from server later
        var numField = document.getElementById("question_upvotes_text_" + id);
        numField.innerHTML = "" + (parseInt(numField.innerHTML, 10) + 1);
        this._http.get("api/QnA/UpvoteQuestion/" + id)
            .subscribe(
                JsonData => {},
                error => alert(error),
                () => console.log("Finished upvoting question -> " + id)
        );

        document.getElementById("question_upvote_" + id).setAttribute('disabled', 'disabled');
        document.getElementById("question_downvote_" + id).setAttribute('disabled', 'disabled');
    }

    downvoteQuestion(id: number) {
        // increment immediately and update from server later
        var numField = document.getElementById("question_downvotes_text_" + id);
        numField.innerHTML = "" + (parseInt(numField.innerHTML, 10) + 1);

        this._http.get("api/QnA/DownvoteQuestion/" + id)
            .subscribe(
                JsonData => {},
                error => alert(error),
                () => console.log("Finished downvoting question -> " + id)
        );

        document.getElementById("question_upvote_" + id).setAttribute('disabled', 'disabled');
        document.getElementById("question_downvote_" + id).setAttribute('disabled', 'disabled');
    }

    upvoteAnswer(questionId: number, answerId: number) {
        // increment immediately and update from server later
        var numField = document.getElementById("answer_upvotes_text_" + questionId + '_' + answerId);
        numField.innerHTML = "" + (parseInt(numField.innerHTML, 10) + 1);
        this._http.get("api/QnA/UpvoteAnswer/" + answerId)
            .subscribe(
                JsonData => {},
                error => alert(error),
                () => console.log("Finished upvoting answer -> " + answerId)
        );

        document.getElementById("answer_upvote_" + answerId).setAttribute('disabled', 'disabled');
    }

    submitQuestion() {
        var question = new QnA();

        question.text = this.questionForm.value.questionText;

        var body: string = JSON.stringify(question);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.post("api/QnA", body, { headers: headers })
            .subscribe(
                retur => {
                    this.fetchAllQuestions();
                    this.showList();
                },
                error => alert(error),
                () => console.log("Finished submitting question -> " + body)
            );
    }

    submitAnswer() {
        var answer = new Answer();

        var questionId = this.answerForm.value.questionId;
        answer.text = this.answerForm.value.answerText;

        var body: string = JSON.stringify(answer);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.post("api/QnA/SaveAnswer/" + questionId, body, { headers: headers })
            .subscribe(
                retur => {
                    this.fetchAllQuestions();
                    this.showList();
                },
                error => alert(error),
                () => console.log("Finished submitting answer -> " + body)
            );
    }

    newAnswer(id: number) {
        this.answerForm.setValue({
            answerText: "",
            questionId: id
        });
        this.answerForm.markAsPristine();
        this.showQnAList = false;
        this.showAnswerForm = true;
        this.showQuestionForm = false;
    }

    newQuestion() {
        this.questionForm.setValue({
            questionText: ""
        });
        this.questionForm.markAsPristine();
        this.showQnAList = false;
        this.showAnswerForm = false;
        this.showQuestionForm = true;
    }
}
