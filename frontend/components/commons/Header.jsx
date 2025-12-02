"use client";
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/navigation";

export default function Header() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);

    const handleLogin = () => { router.push("/login"); };
    const handleSignup = () => { router.push("/signup"); };
    const handleLogout= () => {}
    const handleMypage = () => {}

    return (
        <>
        <header>
            <div id="logo">
                <h1>
                    <Link href="/">Medical.Scan</Link>
                </h1>
            </div>

            {/*<c:if test="${empty admin && empty authUser }">*/}
            {!isLogin &&
                <div className="btn">
                    <input type="button" value="로그인" onClick={handleLogin}/>
                    <input type="button" value="회원가입" onClick={handleSignup}/>
                </div>
            }
            {/*</c:if>*/}

            {/*<c:if test="${not empty authUser }">*/}
            {isLogin &&
                <div className="btn">
                    <input type="button" value="회원정보" onClick={handleMypage}/>
                    <input type="button" id="btn-logout" value="로그아웃" onClick={handleLogout}/>
                </div>
            }
            {/*</c:if>*/}
        </header>

        {isLogin &&
            <nav id="menu">
                <ul>
                    <li><Link href="/patientScan/list">의료 영상 목록</Link></li>
                    <li><Link href="/patients/">환자 목록</Link></li>
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