import React, { useState } from 'react';
import { InputField } from './InputField';
import { QRCode } from 'react-qrcode-logo';
import html2canvas from 'html2canvas';

const QRCodeGenerator = () => {
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
    value: 'https://stabraq.netlify.app/preferences/main/user/',
    ecLevel: 'Q',
    qrStyle: 'dots',
    logoImage: '/logo.png',
    logoWidth: 130,
    mobile: '',
  });
console.log(state);
  const handleChange = ({ target }) => {
    setState((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));

    if (target.name === 'value') {
      setState((prevState) => ({
        ...prevState,
        value: `https://stabraq.netlify.app/preferences/main/user/?mobile=${target.value}`,
        mobile: target.value,
      }));
    }
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

  return (
    <div className='ui container text-center'>
      <div>
        <InputField
          name='value'
          type='text'
          label='Mobile Number'
          maxLength={11}
          handleChange={handleChange}
        />
        <div>
          <QRCode
            {...{
              ...state,
            }}
          />
        </div>
      </div>
      <div className='ui segment mb-3 mt-1'>
        <button
          className='ui primary button stabraq-bg'
          onClick={handleDownload}
          type='submit'
        >
          <i className='download icon me-1' />
          Download QR Code
        </button>
        <button
          className='ui primary button stabraq-bg'
          onClick={shareQR}
          type='submit'
        >
          <i className='share alternate icon me-1' />
          Share QR Code
        </button>
        <button
          className='ui primary button stabraq-bg'
          onClick={whatsApp}
          type='submit'
        >
          <i className='whatsapp icon me-1' />
          Whatsapp
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
