import Image from "next/image";

export default function Home() {
  return (
    <div className="main">
        <p className="p1">Medical.Scan은 의료용 영상을 Film으로 출력하여 진단하던 기존 방식과 달리 현상, 인화가 필요 없는</p>
        <p className="p2" >디지털 방식으로 의료용 영상을 획득, 전송, 진단하는 시스템입니다.</p>
        <Image
            src="/images/main.png"
            alt="Main Banner"
            priority
            width={1200}
            height={500}
            style={{ width: "100%", height: "auto" }}
        />
    </div>
  );
}
