"use client";
import {useState, useRef, useMemo} from "react";
import {useRouter} from "next/navigation";
import {axiosPost} from "@/api/userAPI.js";

const initForm = (initArray) => {
    return initArray.reduce((acc,cur) => {
        acc[cur] = "";
        return acc;
    }, {});
}

export default function Signup() {
    const router = useRouter();
    const initArray = ['id', 'pwd', 'hospital', 'department', 'name', 'email', 'phone'];
    const refs = useMemo(() => {
        return initArray.reduce((acc,cur) => {
            acc[`${cur}Ref`] = React.createRef();
            return acc;
        }, {});
    }, [initArray]);

    const [form, setForm] = useState(initForm(initArray));  //{id:"hong", ...}


    /** 폼 입력값 변경 이벤트 처리 **/
    const handleChangeForm = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value});
        //setErrors({...initForm(initArray), emailDomain: ""});
    }

    /** Signup 이벤트 처리 **/
    const handleSignupSubmit = async(e) => {
        e.preventDefault();
        console.log("fomData ------> ", form);
        //Next.js의 서버를 통해 DB연동하기
        const res = await axiosPost('/user/signup', form);

        const data = await res.json();
        console.log(data);

    }




    return (
        <form className="form-box" onSubmit={handleSignupSubmit}>
            <h1 className="form-title">Sign Up</h1>
            <div className="input-group">
                <label id="label-email" htmlFor="email">ID : </label>
                <div className="email-container">
                    <input  className="input-box"
                            type="text"
                            id="id"
                            name="id"
                            value={form.id}
                            onChange={handleChangeForm}/>
                    <button type="button" style={{width: "30%"}}>Verify</button>
                </div>
            </div>
            <p className="error-msg" id="error-username">&nbsp6~20자리의 영문, 숫자로 입력해주세요.</p>
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
            <p className="error-msg" id="error-pwd">&nbsp특수기호를 포함한 8~16자리의 비밀번호를 입력해주세요.</p>
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
            <p className="error-msg" id="error-hospital-department">&nbsp병원이름 혹은 진료과를 입력해주세요.</p>
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
            <p className="error-msg" id="error-name">&nbsp2~5글자의 한글로 입력해주세요.</p>
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
            <p className="error-msg" id="error-email">이메일 형식에 맞게 입력해주세요.</p>
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
            <p className="error-msg" id="error-phone">사용할 수 없는 전화번호입니다.</p>
            <div className="privacy-consent">
                <input type="checkbox"
                       name="privacy-policy" required/>
                <label htmlFor="privacy-policy">
                    개인정보 수집 및 이용 동의 <a href="#" id="privacy-link">전문보기</a>.
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