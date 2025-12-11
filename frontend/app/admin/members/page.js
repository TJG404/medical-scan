"use client";

import "@/styles/admin.css";

import {useEffect, useState} from "react";
import {postMembers, putMembers} from "@/utils/adminAPI.js";

export default function MembersPage() {
    const [members, setMembers] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const response = await postMembers();
            const {rows} = await response.json();
            setMembers(rows);
        }
        fetchData();
    }, []);

    const handleToggle = ({index}) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    }

    const handleFormChange = (id, e) => {
        const { name, value } = e.target;
        setMembers(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, [name]: value }
                    : item
            )
        );
    }

    const handleMemersUpdateSubmit = async(e, index) => {
        e.preventDefault();

        const member = members.find((member, idx) => idx === index );
        const response = await putMembers(member);
        const { result } = await response.json();
        if(result) {
            alert("수정이 완료되었습니다.");
        }

    }

    return (
        <>
        <div className="tabs">
            <div id="none">관리자 : admin</div>
            <div className="tab active">회원관리</div>
            <div className="tab">가입승인</div>
            <div className="tab">탈퇴승인</div>
            <a href="/admin/logs">
                <div className="tab" id="tab-4">로그</div>
            </a>
        </div>
        {/*// <c:set var="userListSize" value="${fn:length(userList)}"/>*/}
        {/*<input type="hidden" id="max-length" value="${userListSize}"/>*/}
        <div className="tab-content active" id="tab1">
            {!members && <p>세션에 회원 데이터가 없습니다.</p>}

            { members && members.map((member, index) =>
                <div className="member-section" id={`member-${index-1}`} key={index}>
                    <button className="showDropdown" data-id={index} onClick={() => handleToggle({index})}>
                        <span className="showDropdown-span" data-id={index}>No. {index + 1}</span>
                        <span className="showDropdown-span" data-id={index}>CODE: {member.id}</span>
                        <span className="showDropdown-span" data-id={index}>ID: {member.id}</span>
                        <span className="showDropdown-span" data-id={index}>NAME: {member.name}</span>
                    </button>

                    <div id={`dropdownMenu-${index}`}
                         className="dropdown-menu"
                         style={{
                             display: (openIndex === index) ? "block" : "none",
                         }}>
                        <form data-id={index} id="first-tab" onSubmit={(e) => handleMemersUpdateSubmit(e, index)}>
                            <input type="hidden" id={`userCode-tab1-${index}`} name="userCode"
                                   value={member.id}/>

                            <label htmlFor={`username-tab1-${index}`}>ID: </label>
                            <input type="text"
                                   id={`username-tab1-${index}`}
                                   name="username"
                                   value={member.id}
                                   readOnly      />
                            <p className="error-msg" id={`error-message-username-${index}`}>아이디가 중복됩니다.</p>

                            <label htmlFor={`email-tab1-${index}`}>Email:</label>
                            <input type="email"
                                   id={`email-tab1-${index}`}
                                   name="email"
                                   value={member.email}
                                   onChange={(e)=> {handleFormChange(member.id, e)}}
                                   />
                            <p className="error-msg" id={`error-message-email-${index}`}>이메일이 중복됩니다.</p>

                            <div id="dropdown-container">
                                <label htmlFor={`status-tab1-${index}`}>Status:</label>
                                <label>
                                    <select id={`status-tab1-${index}`}
                                            name="status"
                                            defaultValue={member.status}
                                            onChange={(e)=> {handleFormChange(member.id, e)}}>
                                            <option value="active">active</option>
                                            <option value="pending">pending</option>
                                            <option value="suspended">suspended</option>
                                    </select>
                                </label>
                                <label id="account" htmlFor={`accountType-tab1-${index}`}>Account Type:</label>
                                <label>
                                    <select id={`accountType-tab1-${index}`}
                                            name="role"
                                            defaultValue={member.role}
                                            onChange={(e)=> {handleFormChange(member.id, e)}}>
                                            <option value="admin">admin</option>
                                            <option value="user">user</option>
                                            <option value="temporary">temporary</option>
                                    </select>
                                </label>
                            </div>
                            <button className="edit-submit" type="submit">수정 완료</button>
                        </form>
                    </div>
                    {/*}*/}
                </div>
                )}
        </div>

        {/*<div className="tab-content" id="tab2">*/}
        {/*    /!*<c:if test="${empty temporaryList}">*!/*/}
        {/*        <p>세션에 회원 데이터가 없습니다.</p>*/}
        {/*    /!*</c:if>*!/*/}
        {/*    /!*<c:forEach var="temporary" items="${temporaryList}" varStatus="list">*!/*/}
        {/*        <div className="member-section">*/}
        {/*            <button className="showDropdown" data-id="tab2-${list.index}">*/}
        {/*                /!*<span>No. ${list.index + 1}</span>*!/*/}
        {/*                /!*<span>CODE: ${temporary.userCode}</span>*!/*/}
        {/*                /!*<span>ID: ${temporary.username}</span>*!/*/}
        {/*                /!*<span>NAME: ${temporary.name}</span>*!/*/}
        {/*            </button>*/}

        {/*            <div id="dropdownMenu-tab2-${list.index}" className="dropdown-menu">*/}
        {/*                <form data-id="${list.index}" id="second-tab">*/}
        {/*                    <input type="hidden" id="userCode-tab2-${list.index}" name="userCode"*/}
        {/*                           value="${temporary.userCode}"/>*/}

        {/*                    <label htmlFor="userCode-tab2-${list.index}">UserCode:</label>*/}
        {/*                    <input type="text" id="userCode-tab2-${list.index}" name="userCode"*/}
        {/*                           value="${temporary.userCode}" disabled/>*/}

        {/*                    <label htmlFor="username-tab2-${list.index}">ID:</label>*/}
        {/*                    <input type="text" id="username-tab2-${list.index}" name="username"*/}
        {/*                           value="${temporary.username}" disabled/>*/}

        {/*                    <label htmlFor="name-tab2-${list.index}">NAME:</label>*/}
        {/*                    <input type="text" id="name-tab2-${list.index}" name="name" value="${temporary.name}"*/}
        {/*                           disabled/>*/}

        {/*                    <button className="temporary-submit" type="submit">승인</button>*/}
        {/*                </form>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    /!*</c:forEach>*!/*/}
        {/*</div>*/}

        {/*<div className="tab-content" id="tab3">*/}
        {/*    /!*<c:if test="${empty deleteList}">*!/*/}
        {/*        <p>세션에 회원 데이터가 없습니다.</p>*/}
        {/*    /!*</c:if>*!/*/}
        {/*    /!*<c:forEach var="delete" items="${deleteList}" varStatus="list">*!/*/}
        {/*        <div className="member-section">*/}
        {/*            <button className="showDropdown" data-id="tab3-${list.index}">*/}
        {/*                <span>No. ${list.index + 1}</span>*/}
        {/*                <span>CODE: ${delete.userCode}</span>*/}
        {/*                <span>ID: ${delete.username}</span>*/}
        {/*                <span>NAME: ${delete.name}</span>*/}
        {/*            </button>*/}

        {/*            <div id="dropdownMenu-tab3-${list.index}" className="dropdown-menu">*/}
        {/*                <form data-id="${list.index}" id="third-tab">*/}
        {/*                    <input type="hidden" id="userCode-tab3-${list.index}" name="userCode"*/}
        {/*                           value="${delete.userCode}"/>*/}

        {/*                    <label htmlFor="name-tab3-${list.index}">UserCode: </label>*/}
        {/*                    <input type="text" id="name-tab3-${list.index}" name="name" value="${delete.userCode}"*/}
        {/*                           disabled/>*/}

        {/*                    <label htmlFor="email-tab3-${list.index}">ID: </label>*/}
        {/*                    <input type="email" id="email-tab3-${list.index}" name="email" value="${delete.username}"*/}
        {/*                           disabled/>*/}

        {/*                    <label htmlFor="phone-tab3-${list.index}">NAME: </label>*/}
        {/*                    <input type="text" id="phone-tab3-${list.index}" name="phone" value="${delete.name}"*/}
        {/*                           disabled/>*/}

        {/*                    <button className="delete-submit" type="submit">승인</button>*/}
        {/*                </form>*/}
        {/*            </div>*/}
        {/*        </div>*/}
        {/*    /!*</c:forEach>*!/*/}
        {/*</div>*/}

        <div className="tab-content" id="tab4">
        </div>
    </>
    )
}