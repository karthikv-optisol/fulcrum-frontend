import { Pipe, PipeTransform } from '@angular/core';

interface contact {
    company: string;
    first_name: string;
    last_name: string;
    email: string;
}

@Pipe({
    name: 'filterMeetingEmailContactsList',
    pure: false
})

export class FilterMeetingEmailContactsList implements PipeTransform {

    transform(value: contact[], 
        searchByCompany: string, 
        searchByFirstName: string, 
        searchByLastName: string, 
        searchByEmail: string, 
        filterMetadata: any
    ): any[] {

        if (!value) {
            return [];
        }

        return value.filter(item => {
            const companyMatch = !searchByCompany || item.company.toLowerCase().includes(searchByCompany.toLowerCase());
            const firstNameMatch = !searchByFirstName || item.first_name.toLowerCase().includes(searchByFirstName.toLowerCase());
            const lastNameMatch = !searchByLastName || item.last_name.toLowerCase().includes(searchByLastName.toLowerCase());
            const emailMatch = !searchByEmail || item.email.toLowerCase().includes(searchByEmail.toLowerCase());

            return companyMatch && firstNameMatch && lastNameMatch && emailMatch;
        });

    }

}
