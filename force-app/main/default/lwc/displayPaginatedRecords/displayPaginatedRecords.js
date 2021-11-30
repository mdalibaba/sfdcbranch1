import { LightningElement, track, wire  } from 'lwc';
import retrieveAccounts from '@salesforce/apex/PaginationController.retrieveAccounts';
 
//define columns of the datatable

const columns = [
    {label:'Id', fieldName: 'Id'},
    {label:'Name', fieldName: 'Name'},
    {label:'Type', fieldName: 'Type'},
    {label:'BillingCountry', fieldName: 'BillingCountry'},
];

let i=0;

export default class DisplayPaginatedRecords extends LightningElement {
    @track page = 1;
    @track items = [];
    @track data = [];
    @track columns;
    @track startingRecord =1;
    @track endingRecord =0;
    @track pageSize =5;
    @track totalRecountCount =0;
    @track totalPage =0;

    @wire(retrieveAccounts)
    wiredAccount({error, data}){
        if(data) {
            this.items = data;
            this.totalRecountCount = data.length; //here it is 23
            this.totalPage = Math.ceil(this.totalRecountCount / this.pageSize); //here it is 5
            this.data = this.items.slice(0,this.pageSize); 
            this.endingRecord = this.pageSize;
            this.columns = columns;

            this.error = undefined;

        } else if(error) {
            this.error = error;
            this.data = undefined;
        }
    }
    previousHandler() {
        if(this.page > 1){
            this.page = this.page - 1
            this.displayRecordPerPage(this.page);
        }
    }
    nextHandler() {
        if(this.page<this.totalPage && this.page !== this.totalPage){
            this.page = this.page + 1;
            this.displayRecordPerPage(this.page);
        }
    }
    displayRecordPerPage(){
       this.startingRecord = ((page -1) * this.pageSize) ;
       this.endingRecord = (this.pageSize * page);

       this.endingRecord = (this.endingRecord > this.totalRecountCount) 
                           ? this.totalRecountCount : this.endingRecord; 

       this.data = this.items.slice(this.startingRecord, this.endingRecord);

       //increment by 1 to display the startingRecord count, 
       //so for 2nd page, it will show "Displaying 6 to 10 of 23 records. Page 2 of 5"
       this.startingRecord = this.startingRecord + 1;
    }




}