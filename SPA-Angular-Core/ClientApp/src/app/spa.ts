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
    visSkjema: boolean;
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
                Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!<>]{5,500}")
            ]))
        });

        this.answerForm = this.fb.group({
            questionId: [""],
            answerText: new FormControl(null, Validators.compose([
                Validators.required,
                Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!<>]{5,5000}")
            ]))
        });
    }
    
    ngOnInit() {
        this.loading = true;
        this.hentAlleKunder();
        this.visSkjema = false;
        this.showAnswerForm = false;
        this.showQnAList = true;
    }

    showList() {
        this.showQnAList = true;
        this.visSkjema = false;
        this.showAnswerForm = false;
    }

    hentAlleKunder() {
        this._http.get("api/QnA/")
            .subscribe(JsonData => {
                this.allQnA = [];
                if (JsonData) {
                    this.loading = false;
                    for (let kundeObjekt of JsonData.json()) {
                        this.allQnA.push(kundeObjekt);
                        console.log(kundeObjekt);
                    }
                };
            },
            error => alert(error),
            () => console.log("ferdig get-api/QnA")
        );
    };

    submitQuestion() {
        var lagretKunde = new QnA();

        lagretKunde.text = this.questionForm.value.questionText;

        var body: string = JSON.stringify(lagretKunde);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.post("api/QnA", body, { headers: headers })
            .subscribe(
                retur => {
                    this.hentAlleKunder();
                    this.showList();
                },
                error => alert(error),
                () => console.log("ferdig post-api/QnA")
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
                    this.hentAlleKunder();
                    this.showList();
                },
                error => alert(error),
                () => console.log("ferdig post-api/QnA")
            );
    }

    registerAnswer(id: number) {
        this.answerForm.setValue({
            answerText: "",
            questionId: id
        });
        this.answerForm.markAsPristine();
        this.showQnAList = false;
        this.showAnswerForm = true;
        this.visSkjema = false;
    }

    registrerKunde() {
        this.questionForm.setValue({
            questionText: ""
        });
        this.questionForm.markAsPristine();
        this.showQnAList = false;
        this.showAnswerForm = false;
        this.visSkjema = true;
    }

    upvoteQuestion(id: number) {
        // increment immediately and update from server later
        var numField = document.getElementById("question_upvotes_text_" + id);
        numField.innerHTML = "" + (parseInt(numField.innerHTML, 10) + 1);
        this._http.get("api/QnA/UpvoteQuestion/" + id)
            .subscribe(
                JsonData => {},
                error => alert(error),
                () => console.log("ferdig get-api/QnA")
            );
    }

    downvoteQuestion(id: number) {
        // increment immediately and update from server later
        var numField = document.getElementById("question_downvotes_text_" + id);
        numField.innerHTML = "" + (parseInt(numField.innerHTML, 10) + 1);

        this._http.get("api/QnA/DownvoteQuestion/" + id)
            .subscribe(
                JsonData => {},
                error => alert(error),
                () => console.log("ferdig get-api/QnA")
            );
    }

    upvoteAnswer(questionId: number, answerId: number) {
        // increment immediately and update from server later
        var numField = document.getElementById("answer_upvotes_text_" + questionId + '_' + answerId);
        numField.innerHTML = "" + (parseInt(numField.innerHTML, 10) + 1);
        this._http.get("api/QnA/UpvoteAnswer/" + answerId)
            .subscribe(
                JsonData => {},
                error => alert(error),
                () => console.log("ferdig get-api/QnA")
            );
    }
}
