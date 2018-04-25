export class Candidate {
    totalVotes: number;
    electionInformation: {
       candidateNumber: number,
       elected: boolean,
       nameExibition: String,
       age?: number,
       city?: string,
       cityCode?: number,
       situation?: string,
       state?: string,
       politicalParty: {
           initials: String,
           legend?: String,
           legendComposition?: any[],
           name?: String,
           number?: number
       },
       role?: {
           code?: number,
           description?: String        
       }
    };
    personalInformation?: {
        birth?: {
            city?: String,
            cityCode?: number,
            date?: Date,
            state?: String
        },
        document?: String,
        emailAddress?: String,
        gender?: String,
        maritalStatus?: String,
        name?: String,
        nationality?: String,
        occupation?: {
            code?: String,
            description?: String
        },
        race?: String,
        schooling?: String,
        voterRegistration?: String
    };
    _id?: String;

    constructor() {
        this._id = '';
        this.totalVotes = 0;
        this.electionInformation = {
            candidateNumber: 0,
            elected: false,
            nameExibition: '',
            age: 0,
            city: '',
            cityCode: 0,
            situation: '',
            state: '',
            politicalParty: {
                initials: '',
                legend: '',
                legendComposition: [],
                name: '',
                number: 0
            },
            role: {
                code: 0,
                description: ''        
            }
         };
        this.personalInformation = {
            birth: {
                city: '',
                cityCode: 0,
                date: new Date(),
                state: ''
            },
            document: '',
            emailAddress: '',
            gender: '',
            maritalStatus: '',
            name: '',
            nationality: '',
            occupation: {
                code: '',
                description: ''
            },
            race: '',
            schooling: '',
            voterRegistration: ''
        }                   
    }
}
