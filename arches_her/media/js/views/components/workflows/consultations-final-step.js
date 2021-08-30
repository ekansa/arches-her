define([
    'knockout',
    'uuid',
    'arches',
    'views/components/workflows/summary-step',
], function(ko, uuid, arches, SummaryStep) {

    function viewModel(params) {
        var self = this;
        SummaryStep.apply(this, [params]);

        this.resourceData.subscribe(function(val){
            this.reportVals = {
                featureShape: {'name': 'Feature Shape', 'value': this.getResourceValue(val.resource, ['Consultation Area','Geometry','Feature Shape','@display_value'])},
                logDate: {'name': 'Log Date', 'value': this.getResourceValue(val.resource, ['Consultation Dates','Log Date','@display_value'])},
                targetDate: {'name': 'Target Date', 'value': this.getResourceValue(val.resource, ['Consultation Dates','Target Date','Target Date Start','@display_value'])},
                consultationType: {'name': 'Consultation Type', 'value': this.getResourceValue(val.resource, ['Consultation Type','@display_value'])},
                applicationType: {'name': 'Application Type', 'value': this.getResourceValue(val.resource, ['Application Type','@display_value'])},
                developmentType: {'name': 'Development Type', 'value': this.getResourceValue(val.resource, ['Development Type','@display_value'])},
                proposalDescription: {'name': 'Proposal Description', 'value': this.getResourceValue(val.resource, ['Proposal','Proposal Text','@display_value'])},
                planningOfficer: {'name': 'Planning Officer', 'value': this.getResourceValue(val.resource, ['Contacts','Planning Officers','Planning Officer','@display_value'])},
                consultingContact: {'name': 'Consulting Contact', 'value': this.getResourceValue(val.resource, ['Contacts','Consulting Contact','@display_value'])},
                caseworkOfficer: {'name': 'Casework Officer', 'value': this.getResourceValue(val.resource, ['Contacts','Casework Officers','Casework Officer','@display_value'])},
                agent: {'name': 'Agent', 'value': this.getResourceValue(val.resource, ['Contacts','Agents','Agent','@display_value'])},
                owner: {'name': 'Owner', 'value': this.getResourceValue(val.resource, ['Contacts','Owners','Owner','@display_value'])},
                applicant: {'name': 'Applicant', 'value': this.getResourceValue(val.resource, ['Contacts','Applicants','Applicant','@display_value'])},
                relatedFiles:  {'name': 'Related Files', 'value': this.getResourceValue(val.resource, ['Proposal','Digital File(s)','@display_value'])},
                relatedApplicationAreas:  {'name': 'Related Application Areas', 'value': this.getResourceValue(val.resource, ['Consultation Area', 'Geometry', 'Related Application Area', '@display_value'])},
            };

            try {
                this.reportVals.references = val.resource['References'].map(function(ref){
                    return {
                        referenceName: {'name': 'Reference', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference', '@display_value'])},
                        referenceType: {'name': 'Reference Type', 'value': self.getResourceValue(ref, ['Agency Identifier', 'Reference Type', '@display_value'])},
                        agency: {'name': 'Agency', 'value': self.getResourceValue(ref, ['Agency', '@display_value'])}
                    };
                })
            } catch(e) {
                this.reportVals.references = [];
            }

            var geojsonStr = this.getResourceValue(val.resource, ['Consultation Area', 'Geometry', 'Geospatial Coordinates', '@display_value']);
            if (geojsonStr) {
                var geojson = JSON.parse(geojsonStr.replaceAll("'", '"'));
                this.prepareMap(geojson, 'app-area-map-data');
            };
            this.loading(false);
            
            if (!val.resource['Status']) {
                var statusNodegroupId = '6a773228-db20-11e9-b6dd-784f435179ea';
                var statusTemplate = {
                    "tileid": null,
                    "data": {},
                    "nodegroup_id": null,
                    "parenttile_id": null,
                    "resourceinstance_id": null,
                    "sortorder": 0
                };
                statusTemplate["resourceinstance_id"] =  self.resourceid;
                statusTemplate["nodegroup_id"] = statusNodegroupId;
                statusTemplate["data"][statusNodegroupId] =  true;
        
                window.fetch(arches.urls.api_tiles(uuid.generate()), {
                    method: 'POST',
                    credentials: 'include',
                    body: JSON.stringify(statusTemplate),
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(function(response) {
                    // pass;
                }).catch(function(response){
                    // eslint-disable-next-line no-console
                    console.log("The status has not updated: \n", response);
                });        
            }
        }, this);
    }

    ko.components.register('consultations-final-step', {
        viewModel: viewModel,
        template: { require: 'text!templates/views/components/workflows/consultations-final-step.htm' }
    });
    return viewModel;
});
