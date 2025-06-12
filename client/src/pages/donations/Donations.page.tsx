import { useState } from 'react';
import NavBar from '../../components/shared/navbar/NavBar';
import classes from './Donations.module.css';
import { Logo } from '../../assets/svg';
import Button from '../../components/admin/button/Button.component';
import Input from '../../components/admin/input/Input.component';
import TextArea from '../../components/admin/input/TextArea.component';
import FacebookIcon from '../../assets/svg/FacebookIcon';
import LinkedInIcon from '../../assets/svg/LinkedInIcon';
import InstagramIcon from '../../assets/svg/InstagramIcon';
import ShareIcon from '../../assets/svg/ShareIcon';
import DonateProjectCard from '../../components/donate-project-card/DonateProjectCard.component';
import cover from '../../assets/images/money.png';
import Dropdown from '../../components/admin/dropdown/Dropdown.component';
import { projectList } from '../../assets/data/projectList';
import { donationAmounts } from '../../assets/data/donationAmounts';
import { useAppDispatch, useAppSelector } from '../../store';
import { createDonation } from '../../store/features/slices/donations/donations.action';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import { emailRegex } from '../../lib/utils/regex';
import { subscribeToNewsletterAction } from '../../store/features/slices/contacts/contacts.action';
import TikTokIcon from '../../assets/svg/TikTokIcon';

const Donations = () => {
  const [active, setActive] = useState<number>(0);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [purpose, setPurpose] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [donatedBy, setDonatedBy] = useState<string>('');
  const [payerNumber, setPayerNumber] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const { loading } = useAppSelector((state) => state.loader);

  const dispatch = useAppDispatch();

  const onDonate = () => {
    const data = {
      purpose,
      description,
      amount,
      payerNumber,
      donatedBy,
    };
    dispatch(createDonation(data)).then((res: any) => {
      const { payload } = res;
      if (payload?.errors && Array.isArray(payload?.errors)) {
        payload?.errors.forEach((err: any) => {
          toast.error(err);
        });
        return;
      } else {
        toast.success('Thank you for your donation!');
      }
    });
  };

  const handleSubscription = () => {
    const validateEmail = emailRegex.test(email.trim());
    if (validateEmail) {
      dispatch(subscribeToNewsletterAction(email))
        .then((res: any) => toast.success(res?.payload.message))
        .catch((err: any) => toast.error(err?.message));
      setEmail('');
      return;
    } else {
      setError('Invalid Email Address');
      return;
    }
  };

  return (
    <>
      <NavBar />
      <div className={classes.container}>
        <div className={classes.headingContainer}>
          <h1 className={classes.heading}>
            Empower Your Investments: Donate to the Round Table Investment Platform Today!
          </h1>
          <p className={classes.caption}>
            Unlock the Power of Collective Wisdom - Make Your Money Work Smarter. Discover the
            Future of Investing with Round Table - Where Every Contribution Shapes Financial
            Success.
          </p>
        </div>
        <div className={classes.info}>
          <div className={classes.infoLeft}>
            <div className={classes.infoLeftHeading}>
              <h1 className={classes.infoPersonalHeading}>Personal Information</h1>
              <Logo size='16' />
            </div>
            <div
              className={classes.switchActionsCont}
              style={{ marginBottom: active === 1 ? '2rem' : '5rem' }}
            >
              <div className={classes.switchActions}>
                <Button
                  text='General'
                  style={{ marginRight: '12px', opacity: active === 0 ? 1 : 0.6 }}
                  textStyle={{ opacity: active === 0 ? 1 : 0.6 }}
                  onClick={() => setActive(0)}
                  padding='10px 24px'
                />
                <Button
                  style={{ opacity: active === 1 ? 1 : 0.6 }}
                  textStyle={{ opacity: active === 1 ? 1 : 0.6 }}
                  text='To Project'
                  onClick={() => setActive(1)}
                  padding='10px 20px'
                />
              </div>
              {active === 1 && (
                <Dropdown
                  style={{ width: '34%', margin: '14px 0 0px' }}
                  initialValue={projectList[0]?.title}
                  options={projectList}
                  id='title'
                />
              )}
            </div>
            <div className={classes.inputs}>
              <Input
                label='Donated By:'
                placeholder='Full Name'
                onChange={(e: any) => setDonatedBy(e.target.value)}
                value={donatedBy}
                labelStyle={{ fontSize: '12px', color: '#9F9F9F', fontWeight: 'bold' }}
                padding='8px'
                margin='0 0 14px'
                color='#fff'
              />
              <TextArea
                label='Description:'
                placeholder='e.g. I have made investments in this organizations and seen the returns and would really love to make a transfer as a token of appreciation'
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                labelStyle={{ fontSize: '12px', color: '#9F9F9F', fontWeight: 'bold' }}
                padding='8px'
                margin='0 0 14px'
                style={{ boxShadow: 'none', border: '1px solid #dfe1e6' }}
              />
              <TextArea
                label='Purpose:'
                placeholder='e.g Donation to the Camsol Lions family'
                value={purpose}
                onChange={(e: any) => setPurpose(e.target.value)}
                labelStyle={{ fontSize: '12px', color: '#9F9F9F', fontWeight: 'bold' }}
                padding='8px'
                margin='0 0 14px'
                style={{ boxShadow: 'none', border: '1px solid #dfe1e6' }}
              />
              <div className={classes.label}>Donator Number </div>
              <PhoneInput
                country={'cm'}
                value={payerNumber}
                onChange={(phone) => setPayerNumber(`+${phone}`)}
                placeholder='Donator Number'
                containerStyle={{ marginBottom: '14px' }}
                inputStyle={{ width: '100%' }}
                enableSearch
              />
              <div className={classes.amountContainer}>
                <div className={classes.label}>
                  Amount{' '}
                  <span style={{ marginLeft: '5px', fontWeight: 'bold', fontSize: '13px' }}>
                    (XAF)
                  </span>
                </div>
                <div className={classes.amounts}>
                  {donationAmounts.map((am: number) => (
                    <div
                      key={am}
                      className={
                        selectedAmount === am
                          ? `${classes.amount} ${classes.amountActive}`
                          : classes.amount
                      }
                      onClick={() => {
                        setSelectedAmount(am);
                        setAmount(am);
                      }}
                    >
                      {am}
                    </div>
                  ))}
                </div>
              </div>
              <Input
                placeholder='Amount'
                value={String(amount)}
                onChange={(e: any) => setAmount(Number(e.target.value))}
                labelStyle={{ fontSize: '12px', color: '#9F9F9F', fontWeight: 'bold' }}
                padding='8px'
                margin='0 0 14px'
                color='#fff'
              />
              <Button text='Donate Now' padding='14px' onClick={onDonate} loading={loading} />
            </div>
          </div>
          <div className={classes.infoRight}>
            <div className={classes.socilaLinks}>
              <h5 className={classes.linksText}>Social Links</h5>
              <div className={classes.socialIcons}>
                <FacebookIcon />
                <LinkedInIcon
                  style={{ margin: '0 16px' }}
                  href='https://www.linkedin.com/company/camsol-io/mycompany/'
                />
                <InstagramIcon href='https://www.instagram.com/camsol.io/' />
                <TikTokIcon
                  href='https://www.tiktok.com/@camsol.io?is_from_webapp=1&sender_device=pc'
                  style={{ margin: '0 16px' }}
                />
                <ShareIcon />
              </div>
            </div>
            <div style={{ marginBottom: '5rem' }}>
              <h5 className={classes.recentText}>Recents Projects</h5>
              <DonateProjectCard
                title='Gas Visor'
                description='ascascasc ascascascc Cascascanoqwiqowd casca'
                cover={cover}
                style={{ marginBottom: '14px' }}
              />
              <DonateProjectCard
                title='Gas Visor'
                description='ascascasc ascascascc Cascascanoqwiqowd casca'
                cover={cover}
                style={{ marginBottom: '14px' }}
              />
              <div className={classes.hairLine} />
              <hr color='#ececec' />
            </div>
            <div>
              <h5 className={classes.recentText} style={{ textAlign: 'center' }}>
                Subscribe To Newsletters
              </h5>
              <Input
                placeholder='Email'
                value={email}
                padding='6px 8px'
                margin='0 0 10px'
                onChange={(e: any) => setEmail(e.target.value)}
                errorMessage={error}
              />
              <Button text='Subscribe' onClick={handleSubscription} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Donations;
