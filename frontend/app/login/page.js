"use client";

import {useState, useRef} from "react";
import {getLogin} from "@/api/authAPI.js";

export default function Login() {
    // id="signin-form" action="/users/action/signin" method="POST"
    const idRef = useRef(null);
    const pwdRef = useRef(null);
    const [formData, setFormData] = useState({id:'', pwd:''});
    const [errors, setErrors] = useState({id:'', pwd:''});

    /** 입력 폼 데이터 변경 이벤트 처리 **/
    const handleFormChange = (e) => {
console.log(e.target.value);
        const { name, value } = e.target;
        setFormData({...formData, [name]:value});
        setErrors({id:'', pwd:''});
    }

    /** 로그인 버튼 이벤트 처리 **/
    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        const param = {
            idRef: idRef,
            pwdRef: pwdRef,
            setErrors: setErrors,
            errors: errors
        }
console.log(param);

        // const result = await getLogin(formData, param);
        // console.log("result-->> ", result);
        // if(result.login) {
            // login({
            //     userId: result.userId,
            //     role: result.role,
            //     accessToken: result.accessToken});
            //
            // alert("로그인에 성공하셨습니다.");
            //
            // router.push("/");
        // } else {
        //     alert("로그인에 실패, 확인후 다시 진행해주세요.");
        //     setFormData({id:'', pwd:''});
        //     idRef.current.focus();
        // }
    }

    return (
        <form className="form-box" onSubmit={handleLoginSubmit}>
            <h1 className="form-title">Login</h1>
            <div className="input-group">
                <label id="label-email" htmlFor="email">ID : </label>
                <input  className="input-box"
                        style={{width:"85%"}}
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