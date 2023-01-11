import {Component} from '@angular/core';
import {ConfirmationService, MessageService} from "primeng/api";
import {EditBaseComponent} from "../edit-base/edit-base.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-edit-multiple',
    templateUrl: '../edit-base/edit-base.component.html',
    styleUrls: ['../edit-base/edit-base.component.css']
})
export class EditMultipleComponent extends EditBaseComponent
{
    constructor(messageService: MessageService,
                confirmationService: ConfirmationService,
                router: Router,
                route: ActivatedRoute)

    {
        super(messageService, confirmationService, router, route);
    }

    goToData(id
                 :
                 number
    ):
        void
    {
        this.newSelectionEvent.emit(id);
    }

    reset()
        :
        void
    {
        this.resetEvent.emit();
    }
}
