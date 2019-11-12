import {Component, OnInit} from "@angular/core";
import { Http, Response } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import "rxjs/add/operator/map";
import { Headers } from "@angular/http";

import { QnA } from "./QnA";

@Component({
    selector: "min-app",
    templateUrl: "spa.html"
})

export class SPA {
    visSkjema: boolean;
    skjemaStatus: string;
    skjema: FormGroup;
    loading: boolean;

    showQnAList: boolean;
    allQnA: Array<QnA>;
    
    constructor(private _http: Http, private fb: FormBuilder) {
        this.skjema = fb.group({
            id: [""],
            question: [null, Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ\\-. ]{10,500}")])],
            answer: [null, Validators.compose([Validators.required, Validators.pattern("[a-zA-ZøæåØÆÅ\\-. ]{10,500}")])]
        });
    }
   
    ngOnInit() {
        this.loading = true;
        this.hentAlleKunder();
        this.visSkjema = false;
        this.showQnAList = true;
    }

    hentAlleKunder() {
        this._http.get("api/QnA/")
           // .map(returData => {   --- .map er ikke lenger nødvendig!
           //     let JsonData = returData.json();
           //     return JsonData;
           // 
           .subscribe(
              JsonData => {
                   this.allQnA = [];
              if (JsonData) {
                for (let kundeObjekt of JsonData.json()) {
                      this.allQnA.push(kundeObjekt);
                      this.loading = false;
                    }
                };
            },
            error => alert(error),
            () => console.log("ferdig get-api/QnA")
        );
    };

    vedSubmit() {
        if (this.skjemaStatus == "Registrere") {
            this.lagreKunde();
        }
        else if (this.skjemaStatus == "Endre") {
            this.endreEnKunde();
        }
        else {
            alert("Feil i applikasjonen!");
        }
    }

    registrerKunde() {
        // må resette verdiene i skjema dersom skjema har blitt brukt til endringer

        this.skjema.setValue({
            id: "",
            question: "",
            answer: ""
        });
        this.skjema.markAsPristine();
        this.showQnAList = false;
        this.skjemaStatus = "Registrere";
        this.visSkjema = true;
    }

    tilbakeTilListe() {
        this.showQnAList = true;
        this.visSkjema = false;
    }

    lagreKunde() {
        var lagretKunde = new QnA();

        lagretKunde.question = this.skjema.value.question;
        lagretKunde.answer = this.skjema.value.answer;

        var body: string = JSON.stringify(lagretKunde);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.post("api/QnA", body, { headers: headers })
            //.map(returData => returData.toString())
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

    sletteKunde(id: number) {
        this._http.delete("api/QnA/" + id)
            .subscribe(
            retur => {
                this.hentAlleKunder();
            },
            error => alert(error),
            () => console.log("ferdig delete-api/QnA")
        );
    };

    endreKunde(id: number) {
        this._http.get("api/QnA/"+id)
            .subscribe(
            returData => {
                let JsonData = returData.json();
                this.skjema.patchValue({ id: JsonData.id });
                this.skjema.patchValue({ question: JsonData.question });
                this.skjema.patchValue({ answer: JsonData.answer });
                this.skjema.patchValue({ upvotes: JsonData.upvotes });
            },
            error => alert(error),
            () => console.log("ferdig get-api/QnA")
        );
        this.skjemaStatus = "Endre";
        this.visSkjema = true;
        this.showQnAList = false;
    }

    endreEnKunde() {
        var endretKunde = new QnA();

        endretKunde.question = this.skjema.value.question;
        endretKunde.answer = this.skjema.value.answer;

        var body: string = JSON.stringify(endretKunde);
        var headers = new Headers({ "Content-Type": "application/json" });

        this._http.put("api/QnA/" + this.skjema.value.id, body, { headers: headers })
            .subscribe(
            retur => {
                this.hentAlleKunder();
                this.visSkjema = false;
                    this.showQnAList = true;
            },
            error => alert(error),
            () => console.log("ferdig post-api/QnA")
        );
    }
}
