/* eslint-disable max-len */
import React from 'react';
import Helmet from 'react-helmet';
import { browserHistory } from 'react-router';
import {
  Hero,
  HorizontalSplit,
  Section,
} from 'neal-react';
import './Index.scss';

const Head = () => (
  <Helmet
    title="FitMe - Your social fitness network."
  />
);

const Jumbo = () => (
  <Hero
        className="text-center">
    <h1 className="display-4"> Find Your Perfect Fit </h1>
    <p className="lead"> Discover new workout partners and maximize gains.</p>
    <p>
      <a id='index-signup-button' className="btn btn-primary" href="" onClick={() => { browserHistory.push('/signup'); }} role="button">Sign up now</a>
    </p>
  </Hero>
);

const Feature1 = () => (
  <Section>
    <HorizontalSplit padding="sm">
      <div style={{ float: 'left' }}>
        <p className="lead">Become part of a fitness community</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      <div style={{ float: 'right' }}>
        <img className='img-responsive' src="/images/smartphone-half.png"/>
      </div>
    </HorizontalSplit>
  </Section>
);

const Feature2 = () => (
  <Section>
    <HorizontalSplit padding="sm">
      <div>
        <img className="img-responsive" src="/images/laptop.png"/>
      </div>
      <div>
        <p className="lead">Manage your workout schedule</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </HorizontalSplit>
  </Section>
);

const Feature3 = () => (
  <Section>
    <HorizontalSplit padding="md">
      <div>
        <p className="lead">Track your progress</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      <div>
        {/* Insert image */}
      </div>
    </HorizontalSplit>
  </Section>
);

const Index = () => (
  <div className="Index">

    <Head />

    <Jumbo />

    <Feature1 />
    <Feature2 />
    <Feature3 />

  </div>
);

export default Index;
