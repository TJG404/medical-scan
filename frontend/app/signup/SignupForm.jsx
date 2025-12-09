"use client";
import React, {useState, useRef, useMemo} from "react";
import {useRouter} from "next/navigation";
import {postSignup, postIdVerify} from "@/utils/usersAPI.js";
// import {axiosPost} from "@/api/userAPI.js";

const initForm = (initArray) => {
    return initArray.reduce((acc,cur) => {
        acc[cur] = "";
        return acc;
    }, {});
}

export default function Signup() {
    const initArray = ['id', 'pwd', 'hospital', 'department', 'name', 'email', 'phone'];
    const namesArray = ['아이디', '패스워드', '병원명', '부서명', '이름', '이메일', '폰번호'];
    const refs = useMemo(() => {
        return initArray.reduce((acc,cur) => {
            acc[`${cur}Ref`] = React.createRef();
            return acc;
        }, {});
    }, [initArray]);

    const router = useRouter();
    const [form, setForm] = useState(initForm(initArray));
    const [checkFlag, setCheckFlag] = useState(false);
    const [msg, setMsg] = useState('');

    const errors = initArray.reduce((acc, cur, idx) => {
        if(cur === "hospital") {
            acc[cur] = form[idx] ?? "병원명 또는 부서명(을)를 입력해주세요."; // 메시지가 없으면 빈값
        } else {
            acc[cur] = form[idx] ?? namesArray[idx] + "(을)를 입력해주세요."; // 메시지가 없으면 빈값
        }
        return acc;
    }, {});

    /** 폼 입력값 변경 이벤트 처리 **/
    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value});
        if(name === "id") setMsg("");
    }

    /** Signup 이벤트 처리 **/
    const handleSignupSubmit = async(e) => {
        e.preventDefault();

        //Next.js의 서버를 통해 DB연동하기 - app 라우터 사용!
        const response = await postSignup(form);
        if(response.ok) {
            alert("회원가입 성공!!");
            router.push("/login");
        }
    }

    /** Verify(아이디 중복체크) **/
    const handleIdVerify = async () => {
        const response = await postIdVerify({"id": form.id});
        const { result } = await response.json();

        if(result) {
            // alert("이미 사용중인 아이디 입니다.");
            setCheckFlag(false);
            setMsg("이미 사용중인 아이디 입니다.");
        } else {
            setCheckFlag(true);
            setMsg("사용이 가능한 아이디 입니다.");
        }
    }

    return (
        <form className="form-box" onSubmit={handleSignupSubmit}>
            <h1 className="form-title">Sign Up</h1>
            <div className="input-group">
                <label id="label-email" htmlFor="email">ID : </label>
                <div className="email-container">
                    <input  className="input-box"
                            style={{width:"82%"}}
                            type="text"
                            id="id"
                            name="id"
                            value={form.id}
                            onChange={handleChangeForm}
                            />
                    <button type="button"
                            onClick={handleIdVerify}
                            style={{width: "30%"}}>Verify</button>
                </div>
            </div>
            {form.id ? (checkFlag ? <p className="error-msg" style={{color:"yellowgreen"}}>{msg}</p>
                        : <p className="error-msg" >{msg}</p>) : <p className="error-msg">{errors.id}</p>
            }

            <div className="input-group">
                <label id="label-password" htmlFor="pwd">PW : </label>
                <input className="input-box"
                       style={{width:"82%"}}
                       type="password"
                       id="password"
                       name="pwd"
                       value={form.pwd}
                       onChange={handleChangeForm}/>
            </div>
            {form.pwd ? <p className="error-msg"></p>
                         : <p className="error-msg" >{errors.pwd}</p> }
            <div className="input-group" id="input-hospital-department">
                <div className="hospital-department">
                    <div className="hospital" id="input-hospital">
                        <label id="label-hospital" htmlFor="hospital">HN : </label>
                        <input className="input-box"
                               style={{width:"67%"}}
                               type="text"
                               id="hospital"
                               name="hospital"
                               value={form.hospital}
                               onChange={handleChangeForm}/>
                    </div>
                    <div className="department" id="input-department">
                        <label id="label-department" htmlFor="department">DP : </label>
                        <input className="input-box"
                               style={{width:"67%"}}
                               type="text"
                               id="department"
                               name="department"
                               value={form.department}
                               onChange={handleChangeForm}
                        />
                    </div>
                </div>
            </div>
            {form.hospital && form.department ? <p className="error-msg"></p>
                : <p className="error-msg" >{errors.hospital}</p> }
            <div className="input-group" id="input-name">
                <label id="label-name" htmlFor="name">NAME : </label>
                <input className="input-box"
                       style={{width:"78%"}}
                       id="name"
                       type="text"
                       name="name"
                       value={form.name}
                       onChange={handleChangeForm}/>
            </div>
            {form.name ? <p className="error-msg"></p>
                : <p className="error-msg" >{errors.name}</p> }
            <div className="input-group" id="input-email">
                <label id="label-email" htmlFor="email">EMAIL : </label>
                <div className="email-container">
                    <input className="input-box"
                           style={{width:"82%"}}
                           type="text"
                           id="email"
                           name="email"
                           value={form.email}
                           onChange={handleChangeForm}/>
                    {/*<button type="button" id="email-verify-btn">Verify</button>*/}
                </div>
            </div>
            {form.email ? <p className="error-msg"></p>
                : <p className="error-msg" >{errors.email}</p> }
            <div className="input-group" id="input-phone">
                <label id="label-phone" htmlFor="phone">PHONE : </label>
                <input className="input-box"
                       style={{width:"76%"}}
                       type="text"
                       id="phone"
                       name="phone"
                       value={form.phone}
                       onChange={handleChangeForm}/>
            </div>
            {form.phone ? <p className="error-msg"></p>
                : <p className="error-msg" >{errors.phone}</p> }
            <div className="privacy-consent">
                <input type="checkbox"
                       name="privacy-policy" required/>
                <label htmlFor="privacy-policy">
                    개인정보 수집 및 이용 동의   <a href="#" id="privacy-link">전문보기</a>
                </label>
            </div>
            <div id="privacy-modal" className="modal">
                <div className="privacy-modal-content">
                    <span className="close">&times;</span>
                    <h2>개인정보 수집 이용 동의</h2>
                    <pre className="privacy-text">개인정보 보호법 전문내용 추가</pre>
                </div>
            </div>
            <button type="submit">Sign Up</button>
        </form>
    )
}