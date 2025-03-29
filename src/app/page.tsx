
import HomeCenterContainer from "@/containers/HomeCenterContainer/HomeCenterContainer";
import HomeLeftContainer from "@/containers/HomeLeftContainer/HomeLeftContainer";
import HomeRightContainer from "@/containers/HomeRightContainer/HomeRightContainer";
import styles from "./page.module.css"

export default function Home() {
  return (
    <>
      <div className={styles["home-banner"]}></div>
      <div className={styles["home-middle"]}>
        <HomeLeftContainer></HomeLeftContainer>
        <HomeCenterContainer></HomeCenterContainer>
        <HomeRightContainer></HomeRightContainer>
      </div>
    </>
  );
}
