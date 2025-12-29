"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/store/authStore.js";
import {postLogout} from "@/utils/usersAPI.js";

export default function Header() {
    const router = useRouter();
    const isLogin = useAuthStore(s => s.isLogin);
    const userId = useAuthStore(s => s.userId);
    const logout = useAuthStore(s => s.logout);
    const role = useAuthStore(s => s.role);
    const status = useAuthStore(s => s.status);
    const handleLogin = () => { router.push("/login"); };
    const handleSignup = () => { router.push("/signup"); };

    const handleLogout= async() => {
        const response = await postLogout();
        if(response.ok){
            logout();
            router.push("/");
        }
    }
    const handleMypage = () => {}

    return (
        <>
        <header>
            <div id="logo">
                <h1>
                    <Link href="/">Medical.Scan</Link>
                </h1>
            </div>

            {!isLogin &&
                <div className="btn">
                    <input type="button" value="로그인" onClick={handleLogin}/>
                    <input type="button" value="회원가입" onClick={handleSignup}/>
                </div>
            }

            {isLogin &&
                <div className="btn">
                    {role === 'admin' &&
                        <input type="button" value="회원정보" onClick={()=>{ router.push("/admin/members"); }}/>
                    }
                    <input type="button" id="btn-logout" value="로그아웃" onClick={handleLogout}/>
                </div>
            }
        </header>

        {isLogin &&
            <nav id="menu">
                <ul>
                    <li><Link href="/patientScan/list">의료 영상 목록</Link></li>
                    <li><Link href="/patients">환자 목록</Link></li>
                </ul>
            </nav>
        }

        </>

        // <nav id="menu">
        //     <ul>
        //         <li><a href="/patientScan/list">의료 영상 목록</a></li>
        //         <li><a href="/patients/">환자 목록</a></li>
        //     </ul>
        // </nav>
    // <c:choose>
    //     <c:when test="${not empty authUser and authUser.accountType eq 'admin'}">
    //         <nav id="menu">
    //             <ul>
    //                 <li><a href="/admin">관리자페이지</a></li>
    //                 <li><a href="/admin/log">로그목록</a></li>
    //             </ul>
    //         </nav>
    //     </c:when>
    //     <c:otherwise>
    //     {isLogin &&

        // }
    //     </c:otherwise>
    // </c:choose>
)

}