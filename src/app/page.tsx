
import HomeCenterContainer from "@/containers/home/HomeCenterContainer/HomeCenterContainer";
import HomeLeftContainer from "@/containers/home/HomeLeftContainer/HomeLeftContainer";
import HomeRightContainer from "@/containers/home/HomeRightContainer/HomeRightContainer";
import styles from "./page.module.css"

export default function Home() {
  return (
    <>
      <div className={styles["home-banner"]}></div>
      <div className="container-box">
        <HomeLeftContainer></HomeLeftContainer>
        <HomeCenterContainer></HomeCenterContainer>
        <HomeRightContainer></HomeRightContainer>
      </div>
    </>
  );
}
