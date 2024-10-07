export async function getUserID() {
    const url = 'http://localhost:8383/api/user/newUserID';

    const options = {
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        },
    };
    try {
        const response = await fetch(url,options);
        const data = await response.json();
        return data;
        // return response
    }catch (error){
        console.error('Error:',error);
    }
}

export async function getUserHistory(userID) {
    const url = 'http://localhost:8383/api/user/userData';

    const options = {
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        },
        body: userID
    };
    try {
        const response = await fetch(url,options);
        const data = await response.json();
        return data;
        // return response
        }catch (error){
            console.error('Error:',error);
        }
}
