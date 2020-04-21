
const axios = require("axios"); 

echo("AJOUTER un évènement sur les échecs de connection à Strapi : ");
echo("Voir L plugins/users-permissions/controllers ET le provider de connection par emails.");

let successes = 0 ;
let fails = 0;

let todo  = 10;

for(let i = 0; i< todo; i++){
    let j = i;
    axios
        .post('https://impotx.gnitic.com/impotxapi/auth/local', {
            identifier: 'impotx',
            password: 'password' + i
        })
        .then(response => {
            // Handle success.
            console.log('Well done!');
            console.log('User profile', response.data.user, " Password : password"+j);
            console.log('User token', response.data.jwt);

            console.log("Done, success, #", fails + successes+ 1)
            if(fails + (++successes) >= todo){
                console.log("Done : succeeded : " + successes + ",  Failed : " +  fails);
            }
        })
        .catch(error => {
            // Handle error.
            //console.log('An error occurred:', error);
            console.log("Done, fail, #", fails + successes+ 1)
            if((++fails) + successes >= todo){
                console.log("Done : succeeded : " + successes + ",  Failed : " +  fails);
            }
        });
}

