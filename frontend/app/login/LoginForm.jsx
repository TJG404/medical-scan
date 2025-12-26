"use client";

import React, {useState, useRef} from "react";
import {postLogin} from "@/utils/usersAPI.js";
import {useAuthStore} from "@/store/authStore.js";
import {useRouter} from "next/navigation";

export default function Login() {
    const router = useRouter();
    const idRef = useRef(null);
    const pwdRef = useRef(null);
    const [formData, setFormData] = useState({id:'', pwd:''});
    const [errors, setErrors] = useState({id:'', pwd:''});
    const login = useAuthStore((s) => s.login);

    /** 입력 폼 데이터 변경 이벤트 처리 **/
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]:value.trim()});
        setErrors({...errors, [name]:''});
    }

    /** 로그인 버튼 이벤트 처리 **/
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if(idRef.current.value == ""){
            setErrors({...errors, id:"아이디를 입력해주세요"});
        } else if(pwdRef.current.value == ""){
            setErrors({...errors, pwd:"패스워드를 입력해주세요"});
        } else {
            const response = await postLogin(formData);
            const { data, message } = await response.json();
console.log(data);
            if(data.count && response.status === 200) {
                alert(message);
                login({
                    userId: data.id,
                    role: data.role,
                    });
                router.push("/");
            } else {
                alert(message);
                setFormData({id:'', pwd:''});
                idRef.current.value = "";
                pwdRef.current.value = "";
                idRef.current.focus();
            }
        }
   }

    return (
        <form className="form-box" onSubmit={handleLoginSubmit}>
            <h1 className="form-title">Login</h1>
            <div className="input-group">
                <label id="label-email" htmlFor="email">ID : </label>
                <input  className="input-box"
                        style={{width:"85%", textIndent:"6px"}}
                        type="text"
                        id="id"
                        name="id"
                        ref={idRef}
                        value={formData.id}
                        onChange={handleFormChange}
                />
            </div>
            <p className="error-msg" >{errors.id}</p>
            <div className="input-group">
                <label id="label-password" htmlFor="pwd">PW :</label>
                <input  className="input-box"
                        style={{width:"82%"}}
                        type="password"
                        name="pwd"
                        id="password"
                        ref={pwdRef}
                        value={formData.password}
                        onChange={handleFormChange}
                />
            </div>
            <p className="error-msg" >{errors.pwd}</p>
            <button type="submit">Sign In</button>
        </form>
    )
}