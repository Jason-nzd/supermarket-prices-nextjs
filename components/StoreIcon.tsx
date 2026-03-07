import Image from "next/image";
import cdlogo from "../public/images/cd-logo-64.png";
import whlogo from "../public/images/wh-logo.svg";
import pklogo from "../public/images/pk-logo-64.png";
import nwlogo from "../public/images/nw-logo-64-wide.png";
import { Store } from "utilities/utilities";

interface Props {
  store: Store;
  width?: number;
}

export default function StoreIcon({ store, width = 20 }: Props) {
  switch (store) {
    case Store.Countdown:
      return <Image src={cdlogo} width={width} alt="Countdown Logo" />;

    case Store.Warehouse:
      return <Image src={whlogo} width={width} alt="Warehouse Logo" />;

    case Store.Paknsave:
      return <Image src={pklogo} width={width} alt="PaknSave Logo" />;

    case Store.NewWorld:
      return <Image src={nwlogo} width={width} alt="New World Logo" />;

    default:
      return <></>;
  }
}
