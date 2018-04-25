export class Constants {
    public static URL: string = 'http://ironpatriot-api.infinitydata.com.br';
    public static VERSION: string = '1';
    public static country = {
        getStates: '/api/country/getStates?token={0}',
        getCities: '/api/country/getCities/{0}/{1}?token={2}'
    };
    public static city = {
        getDistricts: '/api/city/getDistricts/{0}?token={1}',
        getPoliticalPartyVotes: '/api/city/getPoliticalPartyVotes/{0}/{1}?token={2}'
    };
    public static candidate = {
        getTopCandidates: '/api/candidate/getTopCandidates/{0}/{1}/{2}/{3}/{4}?token={5}',
        getCandidateDetails: '/api/candidate/getCandidateDetails/{0}/{1}/{2}?token={3}',
        getVotesByLocal: '/api/candidate/getVotesByLocal/{0}/{1}/{2}?token={3}',
        getVotesByDistrict: '/api/candidate/getVotesByDistrict/{0}/{1}/{2}'
    };
    public static auth = {
        login: '/login'
    }
}
