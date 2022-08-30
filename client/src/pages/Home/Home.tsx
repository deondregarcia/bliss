import React, { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react';
import Axios from 'axios';

const Home = () => {
    const [userID, setUserID] = useState<number>(0);
    const [bucketList, setBucketList] = useState<any | null>(null);

    const handleSubmit = (e: FormEvent<Element>) => {
        e.preventDefault();
        Axios.get(`http://localhost:3000/view/lists/${userID}`)
        .then(response => {
            console.log(response.data.data[0]);
            setBucketList(response.data.data[0]);
        })
        .catch(err => {
            console.log(err);
        })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const number = Number(e.target.value);
        setUserID(number);
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={userID} onChange={handleChange} />
            </label>
            <input type="submit" value="Submit" />
        </form>
        <p>{bucketList?.title}</p>
        <p>{bucketList?.description}</p>
    </div>
  )
}

export default Home