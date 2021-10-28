import React, { useState, useEffect } from 'react';
import { QRCode } from 'react-qrcode-logo';
import html2canvas from 'html2canvas';
import InputMobile from './InputMobile';
import { checkForMobNum } from '../functions/validation';
import '../config';

const QRCodeGenerator = () => {
  useEffect(() => {
    const mobile = new URLSearchParams(window.location.search).get('mobile');
    if (mobile) {
      onFormChangeSet(mobile);
      checkForErrors(mobile);
    }

    return () => {
      // Anything in here is fired on component unmount.
    };
  }, []);

  const [state, setState] = useState({
    // we init this cause is more practical with TS, but eyeRadius is an optional prop
    eyeRadius: [
      {
        outer: [50, 0, 0, 0],
        inner: [50, 0, 0, 0],
      },
      {
        outer: [0, 50, 0, 0],
        inner: [0, 50, 0, 0],
      },
      {
        outer: [0, 0, 0, 50],
        inner: [0, 0, 0, 50],
      },
    ],
    fgColor: '#ff5500',
    size: '350',
    value: `${global.config.homepage}/preferences/main/user/`,
    ecLevel: 'Q',
    qrStyle: 'dots',
    logoImage: '/logo.png',
    logoWidth: 130,
    mobile: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const onFormChangeSet = async (mobile) => {
    setState((prevState) => ({
      ...prevState,
      mobile: mobile,
      value: `${global.config.homepage}/preferences/main/user/?mobile=${mobile}`,
    }));
  };

  const checkForErrors = async (mobile) => {
    setErrorMessage(await checkForMobNum(mobile));
  };

  const handleChange = async ({ target }) => {
    const mobile = target.value;
    await onFormChangeSet(mobile);
    await checkForErrors(mobile);
  };

  const handleDownload = () => {
    html2canvas(document.querySelector('#react-qrcode-logo')).then(function (
      canvas
    ) {
      const link = document.createElement('a');
      link.download = `qrcode-${state.mobile}.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const shareQR = () => {
    html2canvas(document.querySelector('#react-qrcode-logo')).then(
      async function (canvas) {
        const base64url = canvas.toDataURL();
        const blob = await (await fetch(base64url)).blob();
        const file = new File([blob], `qrcode-${state.mobile}.png`, {
          type: blob.type,
        });
        navigator.share({
          title: 'Hello',
          text: 'Check out your QR code!',
          files: [file],
        });
      }
    );
  };

  const whatsApp = () => {
    window.open(`https://wa.me/2${state.mobile}?text=QR-Code`);
  };

  const renderQRCode = () => {
    if (state.mobile && !errorMessage) {
      return (
        <div className='ui segment mb-3 mt-1'>
          <QRCode
            {...{
              ...state,
            }}
          />
        </div>
      );
    }
    return null;
  };

  const buttonsData = [
    {
      id: 0,
      onClick: handleDownload,
      text: 'Download QR Code',
      icon: 'download',
    },
    {
      id: 1,
      onClick: shareQR,
      text: 'Share QR Code',
      icon: 'share alternate',
    },
    {
      id: 2,
      onClick: whatsApp,
      text: 'Whatsapp',
      icon: 'whatsapp',
    },
  ];

  const renderButtons = () => {
    if (state.mobile && !errorMessage) {
      return (
        <div className='ui segment mb-3 mt-1'>
          {buttonsData.map((item) => {
            const { id, onClick, text, icon } = item;
            return (
              <button
                key={id}
                className='ui primary button stabraq-bg mb-3'
                onClick={onClick}
                type='submit'
              >
                <i className={`${icon} icon me-1`} />
                {text}
              </button>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className='text-center'>
      <form className='ui form error'>
        <div className='ui segment'>
          <InputMobile
            value={state.mobile}
            label='QR By Mobile Number'
            icon='qrcode'
            onFormChange={handleChange}
            errorMessage={errorMessage}
          />
        </div>
      </form>
      {renderQRCode()}
      {renderButtons()}
    </div>
  );
};

export default QRCodeGenerator;
