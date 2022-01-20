import { useEffect, useRef } from 'react';
import { PureFIWidget } from '@purefi/verifier-widget';
import './Item.css';

const Item = (props) => {
  const widgetRef = useRef(null);
  const { address } = props;

  useEffect(() => {
    const widgetInstance = widgetRef.current;
    if (address) {
      PureFIWidget.render(
        widgetRef.current,
        {
          address,
          riskThresholds: {
            low: 20,
            high: 40,
          },
          shouldFlushOnSignerChange: true,
          shouldShowNotice: true,
          shouldCloseModalOnOverlayClick: true,
          shouldCheckSignerAddress: false,
          shouldShowUserRejectedError: false,
          shouldShowMissingSignerError: true,
        },
        (response, thresholds) =>
          console.log('onSuccess', response, thresholds),
        (error) => console.log('onError', error)
      );
    }
    return () => {
      PureFIWidget.unmount(widgetInstance);
    };
  }, [address]);

  return (
    <div className="row">
      <div className="col">
        <div className="item">
          <div className="address">{address.address}</div>
          <div className="widget" ref={widgetRef}></div>
        </div>
      </div>
    </div>
  );
};

export default Item;
