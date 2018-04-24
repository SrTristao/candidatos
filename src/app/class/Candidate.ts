export class Candidate {
    totalVotes: number;
    electionInformation: {
       candidateNumber: number,
       elected: boolean,
       nameExibition: String,
       politicalParty: {
           initials: String
       } 
    }
}
