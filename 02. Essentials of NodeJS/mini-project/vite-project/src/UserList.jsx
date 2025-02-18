import axios from "axios"
import React, { useEffect, useState } from "react"
const UserList = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        axios.get("http://localhost:3030/api/users")
            .then(res => {
                setUsers(res.data)
                setLoading(false)
                console.log(res.data);
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

    return (
        <div>
            <h1>Danh sách người dùng</h1>
            {loading && <p>Đang tải...</p>}
            {error && <p style={{color: 'red'}}>Lỗi: {error}</p>}
            <ul>
                {users.map((user) => (
                    <li key={user._id}>
                        {user.name} - {user.email}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default UserList