import xs from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import React from 'react';
import ReactNative from 'react-native';
import {
  // getBackHandler,
  ListView,
  Image as AnimatedImage,
  h,
} from '@cycle/native/screen';
import NavigationStateUtils from 'NavigationStateUtils';
import styles from './styles';
const {
  Animated,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  NavigationExperimental,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  AlertIOS,
} = ReactNative;

const REPO_URL = 'https://api.github.com/repos/cyclejs/cycle-react-native';
const COLL_URL = 'https://api.github.com/repos/cyclejs/cycle-react-native/events';
const FRACTAL_ARCH_URL = 'http://49.media.tumblr.com/1db4a8e1ca5078c083be764fff512c5d/tumblr_n3wqbrrbqz1sulbzio1_400.gif';
const CHILICORN_URL = 'https://raw.githubusercontent.com/futurice/spiceprogram/master/assets/img/logo/chilicorn_no_text-256.png';

// const onNavigateBack = action => {
//   const backActionHandler = getBackHandler();
//   if (action.type === 'back' || action.type === 'BackAction') {
//     backActionHandler.send();
//   }
// }

const windowWidth = Dimensions.get('window').width;

export function main({Screen, HTTP}) {
  let requestStars$ = xs.of({url: REPO_URL, category: 'stars'});
  let requestEvents$ = xs.of({url: COLL_URL, category: 'events'});
  let request$ = xs.merge(requestStars$, requestEvents$);
  let toast$ = xs.periodic(2000).take(1)
    .mapTo({message: 'Hello world!', type: 'show', duration: 1000});
  return {
    Screen: model(intent(Screen, HTTP)).map(view),
    Toast: toast$,
    HTTP: request$,
  };
}

function intent(Screen, HTTP) {
  let starsResponse$ = HTTP
    .select('stars')
    .flatten()
    .map(res => res.body);

  let eventsResponse$ = HTTP
    .select('events')
    .flatten()
    .map(res => res.body);

  return {
    increment: Screen
      .select('button')
      .events('press')
      .map(ev => +1),

    starsResponse: starsResponse$,

    eventsResponse: eventsResponse$,

    chilicornState: Screen
      .select('chilicorn')
      .events('press')
      .fold(acc => acc ? 0 : 1, 0),

    goToSecondView: Screen
      .select('listitem')
      .events('press')
      .map(profile => ({
        type: 'push',
        key: 'Profile',
        data: profile
      })),

    goToThirdView: Screen
      .select('fractal')
      .events('press')
      .map(profile => ({
        type: 'push',
        key: 'Fractal'
      })),

    goToCreditsView: Screen
      .select('credits')
      .events('press')
      .map(profile => {
        debugger;
        return ({
        type: 'push',
        key: 'Credits'
      })}),

    // back: Screen
    //   .navigateBack()
    //   .map({type: 'back'})
  }
}

function model({increment, starsResponse, eventsResponse, chilicornState, goToSecondView, goToThirdView, goToCreditsView}) {

  // Initial state
  const initialNavigationState = {
    key: 'MainNavigation',
    index: 0,
    title: 'Cycle Native',
    routes: [
      {key: 'Counter'}
    ]
  };

  const counter = increment
    .fold((state, n) => state + n, 0);

  const selectedProfile = goToSecondView
    .startWith({data: {}})
    .map(({data}) => data);

  const navigationState = xs.merge(
    goToSecondView,
    goToThirdView,
    goToCreditsView,
    // back
  )
    .compose(dropRepeats((a, b) => {
      debugger;
      if (a.type === `back` && b.type === `back`) {
        return false
      }
      return a.key === b.key
    }))
    .fold((prevState, action) => {
      return action.type === 'back'
        ? NavigationStateUtils.pop(prevState)
        : NavigationStateUtils.push(prevState, action)
    }, initialNavigationState)

  return xs.combine(counter, chilicornState, starsResponse, eventsResponse, navigationState, selectedProfile)
    .map(([counter, chilicornState, starsResponse, eventsResponse, navigationState, selectedProfile]) => ({
      counter,
      chilicornState,
      starsResponse,
      eventsResponse,
      navigationState,
      selectedProfile
    }));
}

function renderCard(vdom, navigationProps) {
  return h(NavigationExperimental.Card, {
    ...navigationProps,
    selector: 'View:' + navigationProps.scene.key,
    renderScene: () => vdom,
    // onNavigate: onNavigateBack,
  })
}

function renderButton(selector, text) {
  return h(TouchableOpacity, {selector}, [
    h(View, {selector, style: styles.button}, [
      h(Text, {style: styles.buttonText}, text)
    ])
  ])
}

function view(model) {
  return h(NavigationExperimental.CardStack, {
    style: {flex: 1},
    navigationState: model.navigationState,
    // onNavigate: onNavigateBack,
    renderScene: (navigationProps) => {
      const key = navigationProps.scene.key.split('scene_')[1];
      switch (key) {
        case 'Counter':
          return renderCard(CounterView(model), navigationProps);
        case 'Profile':
          return renderCard(ProfileView(model), navigationProps);
        case 'Fractal':
          return renderCard(FractalArchitectureExampleView(model), navigationProps);
        case 'Credits':
          return renderCard(CreditsView(model), navigationProps);
        default:
          console.error('Unexpected view', navigationProps, key);
          return renderCard(<Text>Everything is fucked</Text>, navigationProps);
      }
    },
    renderOverlay: (props) => {
      return h(NavigationExperimental.Header, {...props})
    }
  })
}

function CounterView({counter, starsResponse, eventsResponse}) {
  return h(ScrollView, {style: styles.container}, [
    h(Image, {style: styles.image, source: require('./img/logo.png')}),
    h(Text, {style: styles.header}, 'RNCycle'),
    h(Text, {style: styles.stars}, `★${starsResponse.stargazers_count}`),
    renderButton('button', counter),
    h(Text, {style: styles.stargazers}, 'Events'),
    h(ListView, {items: eventsResponse, renderRow: item =>
      h(TouchableOpacity, {selector: 'listitem'/*, payload: item.actor */}, [
        h(Text, {style: styles.stargazer}, `${item.type} by ${item.actor.login}`)
      ])
    })
  ])
}

function ProfileView({selectedProfile}) {
  // console.log(selectedProfile);
  const size = windowWidth / 2;
  return h(ScrollView, {style: styles.container}, [
    h(View, {style: styles.profile}, [
      h(Image, {style: {borderRadius: size / 2}, source: {
        //uri: 'http://49.media.tumblr.com/1db4a8e1ca5078c083be764fff512c5d/tumblr_n3wqbrrbqz1sulbzio1_400.gif',
        uri: selectedProfile.avatar_url,
        width: size,
        height: size
      }})
    ]),
    h(Text, {style: styles.profileTitle}, selectedProfile.login),
    renderButton('fractal', 'Fractal architecture example'),
    renderButton('credits', 'Demo Credits'),
  ])
}

function FractalArchitectureExampleView(model) {
  const size = windowWidth;
  return h(View, {style: styles.fractal}, [
    h(Image, {source: {
      uri: FRACTAL_ARCH_URL,
      width: size,
      height: size
    }}),
    h(Image, {source: {
      uri: FRACTAL_ARCH_URL,
      width: size,
      height: size
    }}),
  ])
}

function CreditsView({chilicornState}) {
  return h(ScrollView, {style: styles.container}, [
    h(TouchableWithoutFeedback, {selector: 'chilicorn'}, [
      h(AnimatedImage, {
        source: {
          uri: CHILICORN_URL,
          width: windowWidth - 30,
          height: windowWidth - 30,
        },
        animation: Animated.timing,
        initialValue: 0,
        value: chilicornState,
        options: {duration: 5000},
        animate: {
          transform: [
            {
              rotate: {
                inputRange: [0, 1],
                outputRange: ['0deg', '-3600deg']
              }
            },
            {
              scale: {
                inputRange: [0, 0.5, 1],
                outputRange: [1, 0.5, 1]
              }
            }
          ],
        },
      })
    ]),
    h(View, {style: styles.creditsList}, [
      h(Text, {style: styles.creditsListTitle}, 'Thank you #CycleConf!'),
      h(Text, {style: styles.creditsListItem}, 'Hadrien de Cuzey'),
      h(Text, {style: styles.creditsListItem}, 'Oskar Ehnström'),
      h(Text, {style: styles.creditsListItem}, 'Jani Eväkallio'),
      h(Text, {style: styles.creditsListItem}, 'Ossi Hanhinen'),
      h(Text, {style: styles.creditsListItem}, 'Jens Krause'),
      h(Text, {style: styles.creditsListItem}, 'Justin Woo'),
    ])
  ])
}
