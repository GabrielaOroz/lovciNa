import MainBase from "../components/shared/MainBase";
import Tracker from "../components/features/Tracker";
import Researcher from "../components/features/Researcher";

export default function Home() {
  return (
    <MainBase>
      {/* TODO - ovisno o useru, prikazati tracker/manager/researcher */}
      {/*<Tracker />*/}
      <Researcher />
    </MainBase>
  );
}
