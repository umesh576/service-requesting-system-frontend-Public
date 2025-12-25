import MainComp from "./../component/MailComp";
import ServiceContainer from "../component/ServiceContainer";

export default function Home() {
  return (
    <div>
      <MainComp />
      <div>
        <ServiceContainer />
      </div>
    </div>
  );
}
