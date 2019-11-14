import {Component, OnInit} from "@angular/core";
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import "rxjs/add/operator/map";
import { Headers } from "@angular/http";
import { QnA } from "./QnA";
import { Answer } from "./Answer";

@Component({
    selector: "min-app",
    templateUrl: "spa.html"
})

export class SPA {
    visSkjema: boolean;
    showAnswerForm: boolean;
    showQnAList: boolean;

    loading: boolean;

    skjema: FormGroup;
    answerForm: FormGroup;

    allQnA: Array<QnA>;
    
    constructor(private _http: Http, private fb: FormBuilder) {
        //this.skjema = fb.group({
        //    question: [null, Validators.compose([Validators.required, Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!<>]{5,500}")])]
        //});

        //this.answerForm = fb.group({
        //    answerText: [null, Validators.compose([Validators.required, Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!<>]{5,500}")])]
        //});

        this.skjema = new FormGroup({
            question: new FormControl(null, Validators.compose([Validators.required, Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!<>]{5,500}")]))
        });

        this.answerForm = new FormGroup({
            answerText: new FormControl(null, Validators.compose([Validators.required, Validators.pattern("[A-ZÆØÅa-zæøå \s\?\.,\-_\\';:&%!<>]{5,500}")]))
        });
    }
    
    ngOnInit() {
        this.loading = true;
        this.hentAlleKunder();
        this.visSkjema = false;
        this.showAnswerForm = false;
        this.showQnAList = true;
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

    vedSubmit() {
        this.lagreKunde();
    }

    registrerKunde() {
        this.skjema.setValue({
            question: ""
        });
        this.skjema.markAsPristine();
        this.showQnAList = false;
        this.showAnswerForm = false;
        this.visSkjema = true;
    }

    tilbakeTilListe() {
        this.showQnAList = true;
        this.visSkjema = false;
        this.showAnswerForm = false;
    }

    lagreKunde() {
        var lagretKunde = new QnA();

        lagretKunde.text = this.skjema.value.question;

        var body: string = JSON.stringify(lagretKunde);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.post("api/QnA", body, { headers: headers })
            .subscribe(
                retur=> {
                    this.hentAlleKunder();
                    this.visSkjema = false;
                    this.showQnAList = true;
                },
            error => alert(error),
            () => console.log("ferdig post-api/QnA")
        );
    };

    upvoteQuestion(id: number) {
        // increment immediately and update from server later
        var numField = document.getElementById("question_upvotes_text_" + id);
        numField.innerHTML = "" + (parseInt(numField.innerHTML, 10) + 1);
        this._http.get("api/QnA/UpvoteQuestion/" + id)
            .subscribe(
                JsonData => {
                    // Dette er treigt og ser rart ut så baserer meg på å bare oppdatere lokalt med lokale tall

                    //this._http.get("api/QnA/" + id)
                    //    .subscribe(
                    //        returData => {
                    //            let JsonData = returData.json();
                    //            numField.innerHTML = JsonData.upvotes;
                    //        },
                    //        error => alert(error),
                    //        () => console.log("ferdig get-api/QnA")
                    //    );
                },
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
                JsonData => {
                    // Dette er treigt og ser rart ut så baserer meg på å bare oppdatere lokalt med lokale tall

                    //this._http.get("api/QnA/" + id)
                    //    .subscribe(
                    //        returData => {
                    //            let JsonData = returData.json();
                    //            numField.innerHTML = JsonData.downvotes;
                    //        },
                    //        error => alert(error),
                    //        () => console.log("ferdig get-api/QnA")
                    //    );
                },
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
                JsonData => {
                    // Dette er treigt og ser rart ut så baserer meg på å bare oppdatere lokalt med lokale tall

                    //this._http.get("api/QnA/" + id)
                    //    .subscribe(
                    //        returData => {
                    //            let JsonData = returData.json();
                    //            numField.innerHTML = JsonData.upvotes;
                    //        },
                    //        error => alert(error),
                    //        () => console.log("ferdig get-api/QnA")
                    //    );
                },
                error => alert(error),
                () => console.log("ferdig get-api/QnA")
            );
    }
}
