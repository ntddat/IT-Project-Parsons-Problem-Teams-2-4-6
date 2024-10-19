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
        // console.log(data.userID.userID);
        return data.userID;
        // return response
    } catch (error){
        console.error('Error:',error);
        return await getUserID();
    }
}

export async function getUserHistory(userID) {
    // const url = 'http://localhost:8383/api/user/userData';
    const url = `http://localhost:8383/api/user/userData?userID=${userID}`;
    const options = {
        method: 'GET',
        headers:{
            "Content-Type": "application/json"
        },

    };
    try {
        const response = await fetch(url,options);
        const data = await response.json();
        // console.log("Get history:---------------------")
        // console.log("History: " + data)
        // console.log("Finish:---------------------")
        return data;
    } catch (error) {
        console.error('Error:',error);
        return await getUserHistory(userID);
    }
}

export async function changeUserName(userID, name) {
    const url = 'http://localhost:8383/api/user/changeUsername';
    
    const pack = {
        userID: userID,
        newUsername: name,
    };

    console.log(pack);
    
    const options = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(pack),  // Stringify the payload as JSON
    };
    
    try {
        const response = await fetch(url, options);

        if (!response.ok) {  // Check if the response status is not OK
            const errorData = await response.json();  // Parse the error message
            console.error('Error:', errorData.message); 
        } else {
            const data = await response.json();
            console.log('Success:', data);
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
}