import { LightningElement, api, track } from 'lwc';
 
import getResults from '@salesforce/apex/AA_Lead_Conversion_Override.getResults';
import getResultsAlt from '@salesforce/apex/AA_Lead_Conversion_Override.getResultsAlt';
import convertLead from '@salesforce/apex/AA_Lead_Conversion_Override.convertLead';
import getLead from '@salesforce/apex/AA_Lead_Conversion_Override.getLead';
import checkExistingAccounts from '@salesforce/apex/AA_Lead_Conversion_Override.checkExistingAccounts';

export default class Leadconversionoverride extends LightningElement {
 
@api recordId;
@api searchObject;
@api searchTerm;
@api searchField = 'Name';
@api selectRecordId = '';
@api selectRecordId2 = '';
@api selectRecordId3 = '';
@api selectRecordName;
@api selectRecordName2;
@api selectRecordName3;
@api Label;
@api Label2;
@api Label3;
@api searchRecords = [];
@api searchRecords2 = [];
@api searchRecords3 = [];
@api required = false;
@api required2 = false;
@api required3 = false;
@api iconName = 'action:new_account';
@api iconName2 = 'action:new_contact';
@api iconName3 = 'action:new_user';
@api LoadingText = false;
@api LoadingText2 = false;
@api LoadingText3 = false;
@track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
@track txtclassname2 = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
@track txtclassname3 = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
@track messageFlag = false;
@track messageFlag2 = false;
@track messageFlag3 = false;
@track iconFlag =  true;
@track iconFlag2 =  true;
@track iconFlag3 =  true;
@track clearIconFlag = false;
@track clearIconFlag2 = false;
@track clearIconFlag3 = false;
@track inputReadOnly = false;
@track inputReadOnly2 = false;
@track inputReadOnly3 = false;
@api showResults = false;
@api showResults2 = false;
@api showResults3 = false;
 
@api convertedStatus = '--None--';
@api disableConSearch = false;
@api disableNewCon = false;
 
@api rec;
@api renderDone = false;
@api Spinner = false;
@api newConFlag = false;
@api existConFlag = false;

@api stopProcess = false;

@api searchCons;
@api showConChoices = false;
@track consChoice = 0;

@track openmodal = false;

@api convConID;
@api showAccBtn = false;
@api showCtcBtn = false;
 
    connectedCallback(){
        this.Spinner = true;
        this.showCtcBtn = true;
        console.log("Check record ID: " + this.recordId);
        getLead({"recordId" : this.recordId})
            .then(
                result=>{
                    this.rec = result;
                    console.log('Rec.email: ' + this.rec.Email);
                    if(this.rec.Email !== undefined && this.rec.Email !== null && this.rec.Email.length > 2){
                        this.renderDone = true;
                        }
                    else{
                        this.stopProcess = true;
                        }
                        this.Spinner = false;
                    }
                )
            .catch(
                error=>{
                    console.log('Error: ' + error.message);
                    this.Spinner = false;
                    }
                );
        }
 
    searchLookup(event){
        console.log('Initiating Field: ' + event.target.name);
        if(event.target.name === 'searchText'){
            this.searchObject = 'Account';
            this.LoadingText = true;
            }
        else if(event.target.name === 'searchText2'){
            this.searchObject = 'Contact';
            this.LoadingText2 = true;
            }
        else if(event.target.name === 'searchText3'){
            this.searchObject = 'User';
            this.LoadingText = true;
            }
        this.searchTerm = event.target.value;
        console.log('Search Term: ' + this.searchTerm);
        this.Spinner = true;
        var state = this.rec.State;
        console.log('State for search: ' + state);
        if(state === undefined || state.length < 1){
            state = '.';
            }
        if(this.searchTerm.length >= 3){

        if(this.searchObject === 'Account'){
            console.log('Object Name: ' + this.searchObject);
            console.log('SearchField: ' + this.searchField);
            console.log('SearchTerm: ' + this.searchTerm);
            console.log('State: ' + state);
            getResultsAlt(
                        {
                        "ObjectName" : this.searchObject, 
                        "fieldName" : this.searchField, 
                        "value" : this.searchTerm,
                        "state" : state
                        })
            .then(
                result=>{
                    console.log("Search Object: " + this.searchObject);
                    if(this.searchObject === 'Account'){
                        this.searchRecords = result;
                        this.LoadingText = false;
                        this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                        if(this.searchTerm.length > 0 && result.length === 0) {
                            this.messageFlag = true;
                            this.showResults = true;
                            }
                        else {
                            this.messageFlag = false;
                            this.showResults = false;
                            }
                            this.iconFlag = true;
                            this.clearIconFlag = false;
                            this.showResults = true;
                        }
                    else if(this.searchObject === 'Contact'){
                        this.searchRecords2 = result;
                        this.LoadingText2 = false;
                        this.txtclassname2 =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                        if(this.searchTerm.length > 0 && result.length === 0) {
                            this.messageFlag2 = true;
                            this.showResults2 = true;
                            }
                        else {
                            this.messageFlag2 = false;
                            this.showResults2 = false;
                            }
                            this.iconFlag2 = true;
                            this.clearIconFlag2 = false;
                            this.showResults2 = true;
                        }
                    else if(this.searchObject === 'User'){
                        this.searchRecords3 = result;
                        this.LoadingText3 = false;
                        this.txtclassname3 =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                        if(this.searchTerm.length > 0 && result.length === 0) {
                            this.messageFlag3 = true;
                            this.showResults3 = true;
                            }
                        else {
                            this.messageFlag3 = false;
                            this.showResults3 = false;
                            }
                            this.iconFlag3 = true;
                            this.clearIconFlag3 = false;
                            this.showResults3 = true;
                        }
                        this.Spinner = false;
                    }
                )
            .catch(
                error=>{
                    alert("Error fetching results: " + error.message);
                    this.Spinner = false;
                    }
            );
            }
        else{
        getResults({"ObjectName" : this.searchObject, "fieldName" : this.searchField, "value" : this.searchTerm})
            .then(
                result=>{
                    console.log("Search Object: " + this.searchObject);
                    if(this.searchObject === 'Account'){
                        this.searchRecords = result;
                        this.LoadingText = false;
                        this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                        if(this.searchTerm.length > 0 && result.length === 0) {
                            this.messageFlag = true;
                            this.showResults = true;
                            }
                        else {
                            this.messageFlag = false;
                            this.showResults = false;
                            }
                            this.iconFlag = true;
                            this.clearIconFlag = false;
                            this.showResults = true;
                        }
                    else if(this.searchObject === 'Contact'){
                        this.searchRecords2 = result;
                        this.LoadingText2 = false;
                        this.txtclassname2 =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                        if(this.searchTerm.length > 0 && result.length === 0) {
                            this.messageFlag2 = true;
                            this.showResults2 = true;
                            }
                        else {
                            this.messageFlag2 = false;
                            this.showResults2 = false;
                            }
                            this.iconFlag2 = true;
                            this.clearIconFlag2 = false;
                            this.showResults2 = true;
                        }
                    else if(this.searchObject === 'User'){
                        this.searchRecords3 = result;
                        this.LoadingText3 = false;
                        this.txtclassname3 =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
                        if(this.searchTerm.length > 0 && result.length === 0) {
                            this.messageFlag3 = true;
                            this.showResults3 = true;
                            }
                        else {
                            this.messageFlag3 = false;
                            this.showResults3 = false;
                            }
                            this.iconFlag3 = true;
                            this.clearIconFlag3 = false;
                            this.showResults3 = true;
                        }
                        this.Spinner = false;
                    }
                )
            .catch(
                error=>{
                    alert("Error fetching results: " + error.message);
                    this.Spinner = false;
                    }
            );
                }
            }
        }

    setSelectedRecord(event) {
        var currentRecId = event.currentTarget.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        var selectedEvent;
        if(this.searchObject === 'Account'){
            this.showConChoices = false;
            this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
            this.iconFlag = false;
            this.clearIconFlag = true;
            this.selectRecordName = event.currentTarget.dataset.name;
            this.selectRecordId = currentRecId;
            this.inputReadOnly = false;
            selectedEvent = new CustomEvent('selected', { detail: {selectName, currentRecId}, });
            this.showResults = false;
            checkExistingAccounts({"accID" : this.selectRecordId,
                                   "leadEmail" : this.rec.Email}).then(
                result=>{
                        this.searchCons = result;
                        console.log('Search Cons: ' + this.searchCons);
                        if(this.searchCons === undefined || this.searchCons.length < 1){
                            console.log('No Search results.');
                            }
                        else{
                            this.showConChoices = true;
                            }
                    }
                    )
                .catch(
                    error=>{
                        console.log('Error searching Account matches: ' + error.message);
                    }
                    );
            }
        else if(this.searchObject === 'Contact'){
            this.txtclassname2 =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
            this.iconFlag2 = false;
            this.clearIconFlag2 = true;
            this.selectRecordName2 = event.currentTarget.dataset.name;
            this.selectRecordId2 = currentRecId;
            this.inputReadOnly2 = false;
            selectedEvent = new CustomEvent('selected', { detail: {selectName, currentRecId}, });
            this.showResults2 = false;
            }
        else if(this.searchObject === 'User'){
            this.txtclassname3 =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
            this.iconFlag3 = false;
            this.clearIconFlag3 = true;
            this.selectRecordName3 = event.currentTarget.dataset.name;
            this.selectRecordId3 = currentRecId;
            this.inputReadOnly3 = false;
            selectedEvent = new CustomEvent('selected', { detail: {selectName, currentRecId}, });
            this.showResults3 = false;
            }
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
        }
        
        // eslint-disable-next-line no-unused-vars
    resetData(event){
        this.selectRecordName = "";
        this.selectRecordId = "";
        this.inputReadOnly = false;
        this.iconFlag = true;
        this.clearIconFlag = false;
        this.showResults = false;
        }
    
    handleFormInputChange(event){
        var name = event.target.name;
        var val = event.target.value;
        var rad = this.template.querySelectorAll(".rad");
 
        if(name === 'status'){
            this.convertedStatus = val;
            }
        else if(name === 'newCon'){
            rad.forEach(function(element){
                if(element.name === 'existCon'){
                    element.checked = false;
                    this.newConFlag = true;
                    this.existConFlag = false;
                    }
                else if(element.name === 'searchText2'){
                    element.disabled = true;
                    }
                }, this);
            }
        else if(name === 'existCon'){
            rad.forEach(function(element){
                console.log('Name: ' + element.name);
                if(element.name === 'newCon'){
                    element.checked = false;
                    this.newConFlag = false;
                    this.existConFlag = true;
                    }
                else if(element.name === 'searchText2'){
                    element.disabled = false;
                    }
                }, this);
            }
 
        }
    
    closeModal() {
        this.openmodal = false
        }

    openAccount(){
        window.open('\\'+this.selectRecordId);
        }

    openContact(){
        window.open('\\lightning\\r\\Contact\\' + this.convConID + '\\view');
        }

    cancel(){
        window.location.replace('\\' + this.recordId);
        }

    get options() {
            return [
                { label: 'Proceed as normal.  Create new Contact or Append to existing based on choices made in Contact section below.', value: 1 },
                { label: 'Add Contact as selected below, but request merge of the existing records so that the proper parent becomes the Account selected above.', value: 2 },
                { label: 'Do Not Create/Update a Contact, just convert the Lead.  ***Skip the Contact section below if choosing this option.***', value: 3 }
            ];
        }

    convert(){
        var proceed = true;
        this.Spinner = true;
        console.log('consChoice: ' + this.consChoice);
        if(this.newConFlag === true && (this.selectRecordId === undefined || this.selectRecordId.length < 15)){
            proceed = false;
            alert('If creating a new Contact, an existing Account must be selected to attach it to.');
            this.Spinner = false;
            }
        
        /*if(this.selectRecordId3 === undefined || this.selectRecordId3.length < 15){
            proceed = false;
            alert('A record Owner Must be provided.');
            }*/

        if((this.newConFlag === false && (this.existConFlag === false && (this.selectRecordId2 === undefined || this.selectRecordId2.length < 15))) && this.consChoice !== 3){
            proceed = false;
            this.Spinner = false;
            alert('You must choose to either create a new contact or append to an existing contact.');
            }
 
        if(this.convertedStatus === '--None--'){
            proceed = false;
            this.Spinner = false;
            alert('A Converted Status value must be selected from the list.');
            }
 
            if(proceed === true){
                console.log('Vars:  leadID: ' + this.recordId + ' accID: ' + this.selectRecordId + ' ctcID: ' + this.selectRecordId2 + ' ownerID: ' + this.selectRecordId3 + ' convStat: ' + this.convertedStatus);
                var lId = this.recordId;
                var aId = this.selectRecordId;
                var cId = this.selectRecordId2;
                var convStat = this.convertedStatus;
                var cons = this.searchCons;
                var choice = this.consChoice;

                if(aId === undefined || aId.length === 0){
                    aId = null;
                    }
                if(cId === undefined  || cId.length === 0){
                    cId = null;
                    }
                if(convStat === undefined || convStat.length === 0){
                    convStat = null;
                    }
                if(cons === undefined){
                    cons = null;
                    }

                convertLead({'leadId' : lId, 
                             'accID' : aId, 
                             'ctcID' : cId, 
                             'convStat': convStat,
                             'cons': cons,
                             'choice' : choice}).then(
                        result=>{
                            var resp = result;
                            if(resp.includes('Lead successfully converted based on selections.')){
                                this.Spinner = false;
                                this.convConID = resp.substring(58, resp.length);
                                this.openmodal = true;
                                if(this.selectRecordId !== undefined){
                                    this.showAccBtn = true;
                                    }
                                if(this.consChoice === 3){
                                    this.showCtcBtn = false;
                                    }
                                }
                            else{
                                alert("Issue with the conversion process: " + resp);
                                this.Spinner = false;
                                }
                            }
                        )
                    .catch(
                        error=>{
                            alert('Error in conversion process: ' + error.message);
                            this.Spinner = false;
                            }
                    );
                }
        }
}