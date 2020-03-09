public with sharing class AA_Lead_Conversion_Override{
 
    @AuraEnabled(cacheable=true)
    public static List<SObJectResult> getResults(String ObjectName, String fieldName, String value, string state) {
        List<SObJectResult> sObjectResultList = new List<SObJectResult>();
        system.debug(fieldName+'-------------'+ObjectName+'---++----------'+value);
        if(String.isNotEmpty(value))
            if(ObjectName != 'Account'){
                for(sObject so : Database.Query('Select Id,'+fieldName+' FROM '+ObjectName+' WHERE '+fieldName+' LIKE \'%' + value + '%\' ORDER BY '+fieldName+' LIMIT 200')) {
                    String fieldvalue = (String)so.get(fieldName);
                    sObjectResultList.add(new SObjectResult(fieldvalue, so.Id));
                    }
                }
            else{
                for(sObject so : Database.Query('Select Id,'+fieldName+' FROM '+ObjectName+' WHERE State =:' +state+ ' AND '+fieldName+' LIKE \'%' + value + '%\' ORDER BY '+fieldName+' LIMIT 200')) {
                    String fieldvalue = (String)so.get(fieldName);
                    sObjectResultList.add(new SObjectResult(fieldvalue, so.Id));
                    }
                }
        return sObjectResultList;
        }
    
    public class SObJectResult {
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public Id recId;
        
        public SObJectResult(String recNameTemp, Id recIdTemp) {
            recName = recNameTemp;
            recId = recIdTemp;
        }
    }

    @AuraEnabled
    public static list<Contact> checkExistingAccounts(string leadEmail){
        list<Contact> cons = new list<Contact>();
        cons = [SELECT ID, Name, Email, Account.Id, Account.Name FROM Contact WHERE Email =: leadEmail];
        return cons;
        }
 
    @AuraEnabled
    public static string convertLead(ID leadId, ID accID, ID ctcID, string convStat, list<Contact> cons, integer choice){
        string response;
        ID conRecType = AA_UtilityClass.getsrsContact;
        try{
        Lead l = new Lead();
        l = [SELECT ID, 
                    Street, 
                    City, 
                    State, 
                    PostalCode, 
                    Company, 
                    Description, 
                    Email, 
                    Fax, 
                    FirstName, 
                    LastName, 
                    HasOptedOutOfEmail, 
                    Industry, 
                    IsConverted, 
                    MobilePhone, 
                    NumberOfEmployees, 
                    OwnerId, 
                    Phone, 
                    Rating, 
                    Salutation, 
                    Status, 
                    Title
                    FROM Lead
                    WHERE ID =: leadId];
        Account a = new Account();
        Contact c = new Contact();
        a = [SELECT ID, BillingStreet, BillingCity, BillingState, BillingPostalCode, Website FROM Account WHERE ID =: accID];
        if(ctcID == null){
            c.FirstName = l.FirstName;
            c.LastName = l.LastName;
            c.MailingStreet = a.BillingStreet;
            c.MailingCity = a.BillingCity;
            c.MailingState = a.BillingState;
            c.MailingPostalCode = a.BillingPostalCode;
            c.Title = l.Title;
            c.Phone = l.Phone;
            c.Fax = l.Fax;
            c.Salutation = l.Salutation;
            c.AccountID = a.ID;
            c.RecordTypeID = conRecType;
            insert c;
            }
        else{
            c = [SELECT ID, 
                        FirstName, 
                        LastName,
                        MailingStreet,
                        MailingCity,
                        MailingState,
                        MailingPostalCode,
                        Title,
                        Phone,
                        Fax,
                        Salutation,
                        Description,
                        HasOptedOutOfEmail,
                        MobilePhone
                        FROM Contact 
                        WHERE ID =: ctcID];

                if(c.FirstName == null){
                    c.FirstName = l.FirstName;
                    }
                if(c.LastName == null){
                    c.LastName = l.LastName;
                    }
                if(c.MailingStreet == null){
                    c.MailingStreet = l.Street;
                    }
                if(c.MailingCity == null){
                    c.MailingCity = l.City;
                    }
                if(c.MailingState == null){
                    c.MailingState = l.State;
                    }
                if(c.MailingPostalCode == null){
                    c.MailingPostalCode = l.PostalCode;
                    }
                if(c.Title == null){
                    c.Title = l.Title;
                    }
                if(c.Phone == null){
                    c.Phone = l.Phone;
                    }
                if(c.Fax == null){
                    c.Fax = l.Fax;
                    }
                if(c.Salutation == null){
                    c.Salutation = l.Salutation;
                    }
                if(c.Description == null){
                    c.Description = l.Description;
                    }
                if(c.HasOptedOutOfEmail == null){
                    c.HasOptedOutOfEmail = l.HasOptedOutOfEmail;
                    }
                if(c.MobilePhone == null){
                    c.MobilePhone = l.MobilePhone;
                    }
                c.RecordTypeID = conRecType;
            update c;
            }
            
            Database.Leadconvert lc = new Database.Leadconvert();
            lc.setLeadId(l.id);
            LeadStatus convertStatus = [select id,ApiName from LeadStatus where isConverted=true limit 1];
            lc.setConvertedStatus(convertStatus.ApiName);
            lc.setContactId(c.Id);
            lc.setAccountId(a.Id);
            lc.setConvertedStatus('Assigned');
            Database.LeadConvertResult lcr = Database.convertLead(lc);
            response = 'Lead successfully converted based on selections. Contact: ' + c.ID;
            }
        catch(Exception E){
            response = 'Error in conversion process: ' + e.getMessage();
            }
        return response;
        }
 
    @AuraEnabled
    public static Lead getLead(ID recordId){
        Lead l = new Lead();
        l = [SELECT ID, Name, Owner.Id, Owner.Name, Email, State FROM Lead WHERE ID =: recordId];
        return l;
        }

}
