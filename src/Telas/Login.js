import React from 'react';
import * as Google from 'expo-google-app-auth';
import { Image ,StatusBar, TextInput, Text, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import firebase from 'firebase';
import Svg, { Circle, Path } from 'react-native-svg';

console.disableYellowBox = true;

export default function Login() {

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('Resposta do autenticador do Google', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(function(result){
            console.log('Usuário logado');
          
            if (result.additionalUserInfo.isNewUser){
              firebase
                .database()
                .ref('/usuario/' + result.user.uid)
                .set({
                  foto: result.additionalUserInfo.profile.picture,
                  email: result.user.email,
                  nome: result.additionalUserInfo.profile.given_name,
                  sobrenome: result.additionalUserInfo.profile.family_name,
                })
                .then(function (snapshot) {
                  //console.log('Snapshot', snapshot)
                })
            } else {
              firebase
                .database()
                .ref('/usuario/' + result.user.uid).update({
                  ultimo_login: Date.now()
                })

            }
          }).catch(function(error) {
          
            var errorCode = error.code;
            var errorMessage = error.message;
            
            var email = error.email;
            
            var credential = error.credential;
          
        });
      } else {
        console.log('Usuário já esta logado');
      }
    }.bind(this));
  }

   signInWithGoogleAsync = async() => {
    try {
      const result = await Google.logInAsync({
        behavior: 'web',
        androidClientId: '416305188082-cvnkvar60ihsmir57emdfi2783ri1sa2.apps.googleusercontent.com',
        iosClientId: '416305188082-9t2dlsk6ld5qnl0n8dmsm54d9fshitq3.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
      });
  
      if (result.type === 'success') {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  }
  
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
      <SafeAreaView style={styles.container}>
        <Svg width="203" height="64" viewBox="0 0 203 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M19.598 8.47299C20.697 7.96599 20.539 7.18399 20.377 6.79699L20.258 6.56499C19.775 5.62199 18.975 5.68899 18.519 5.82099C7.944 10.397 0.475004 20.761 0.160004 32.944C0.217004 33.77 0.655004 33.971 0.952004 34.006H1.665C1.998 33.944 2.455 33.673 2.539 32.679C2.547 32.599 2.559 32.536 2.572 32.472C3.268 21.707 10.021 12.622 19.465 8.54299C19.514 8.51999 19.541 8.49999 19.598 8.47299Z" fill="#EF2A5A"/>
          <Path d="M45.815 5.96299C44.586 5.47599 44.021 6.04499 43.825 6.36599L43.565 6.87299C43.434 7.20999 43.336 7.95299 44.629 8.57199C44.659 8.58599 44.677 8.59899 44.704 8.61399C54.102 12.747 60.794 21.857 61.437 32.62C61.442 32.62 61.456 32.612 61.456 32.612C61.456 32.612 61.409 34.03 62.582 34.03H62.902C63.219 34.004 63.78 33.815 63.839 32.935C63.526 20.886 56.209 10.611 45.815 5.96299Z" fill="#EF2A5A"/>
          <Path d="M32 10.255C18.745 10.255 7.999 20.999 7.999 34.254C7.999 47.509 18.745 58.255 32 58.255C45.254 58.255 56.001 47.509 56.001 34.254C56.001 20.999 45.254 10.255 32 10.255ZM44.676 37.648C44.662 37.898 44.636 38.15 44.604 38.404C43.798 44.682 38.447 49.538 31.95 49.538C25.958 49.538 20.954 45.406 19.581 39.839C18.148 32.951 22.734 27.907 23.077 27.539C23.713 26.86 24.332 26.266 24.799 25.839L24.801 25.851C25.17 25.506 25.524 25.196 25.847 24.921H25.849L25.854 24.917C25.854 24.917 27.514 23.564 27.161 24.916C26.633 26.743 25.883 30.019 26.495 32.208C26.495 32.208 26.5 32.222 26.5 32.225C26.528 32.324 26.569 32.41 26.603 32.501C26.791 32.935 27.264 33.688 28.289 33.584C28.577 33.584 29.284 33.013 29.5 32.236C30.659 27.575 29.555 23.229 28.648 20.772C28.648 20.771 28.648 20.771 28.648 20.771C28.318 19.809 28.402 19.333 28.407 19.314C28.511 19.076 28.72 18.884 29.145 19.014C29.209 19.046 29.278 19.07 29.341 19.103L29.339 19.101C29.434 19.145 29.524 19.178 29.638 19.253C29.707 19.297 29.76 19.323 29.814 19.35C30.288 19.622 31.069 20.123 31.966 20.909C31.971 20.911 31.971 20.913 31.973 20.914C31.976 20.917 31.978 20.919 31.979 20.922C34.22 22.889 37.139 26.64 37.685 32.971C37.689 32.971 37.696 32.968 37.696 32.968C37.696 32.968 37.738 34.108 38.449 34.405C39.16 34.704 39.661 33.619 39.737 33.25C39.761 33.143 39.788 33.021 39.812 32.883C39.813 32.872 39.869 32.239 39.86 31.335C39.816 29.671 39.431 28.394 38.837 27.289L38.856 27.3C38.856 27.3 38.77 26.999 39.078 26.828C39.225 26.729 39.46 26.725 39.682 26.929C40.789 27.939 42.242 29.363 42.911 30.432C43.857 32.105 44.8 34.518 44.693 37.407C44.685 37.486 44.682 37.568 44.676 37.648Z" fill="#EF2A5A"/>
          <Path d="M83.8848 25.4717C83.8848 24.4577 83.6227 23.6943 83.0986 23.1816C82.5859 22.6576 81.646 22.1164 80.2788 21.5581C77.7837 20.6125 75.9893 19.5073 74.8955 18.2427C73.8018 16.9666 73.2549 15.4627 73.2549 13.731C73.2549 11.6346 73.9954 9.9541 75.4766 8.68945C76.9691 7.41341 78.8604 6.77539 81.1504 6.77539C82.6771 6.77539 84.0386 7.1001 85.2349 7.74951C86.4312 8.38753 87.3483 9.29329 87.9863 10.4668C88.6357 11.6403 88.9604 12.9733 88.9604 14.4658H83.9531C83.9531 13.3037 83.7025 12.4207 83.2012 11.8169C82.7113 11.2017 81.9992 10.894 81.0649 10.894C80.1877 10.894 79.5041 11.1561 79.0142 11.6802C78.5243 12.1929 78.2793 12.8879 78.2793 13.7651C78.2793 14.4487 78.5527 15.0697 79.0996 15.6279C79.6465 16.1748 80.6149 16.7445 82.0049 17.3369C84.4316 18.2142 86.1919 19.2909 87.2856 20.5669C88.3908 21.8429 88.9434 23.4665 88.9434 25.4375C88.9434 27.6022 88.2541 29.2941 86.8755 30.5132C85.4969 31.7323 83.6227 32.3418 81.2529 32.3418C79.6465 32.3418 78.1825 32.0114 76.8608 31.3506C75.5392 30.6898 74.5024 29.7441 73.7505 28.5137C73.0099 27.2832 72.6396 25.8306 72.6396 24.1558H77.6812C77.6812 25.5913 77.9603 26.6338 78.5186 27.2832C79.0768 27.9326 79.9883 28.2573 81.2529 28.2573C83.0075 28.2573 83.8848 27.3288 83.8848 25.4717ZM97.5225 32H92.498V7.11719H97.5225V32ZM112.254 25.4717C112.254 24.4577 111.992 23.6943 111.468 23.1816C110.955 22.6576 110.015 22.1164 108.648 21.5581C106.153 20.6125 104.358 19.5073 103.265 18.2427C102.171 16.9666 101.624 15.4627 101.624 13.731C101.624 11.6346 102.365 9.9541 103.846 8.68945C105.338 7.41341 107.229 6.77539 109.52 6.77539C111.046 6.77539 112.408 7.1001 113.604 7.74951C114.8 8.38753 115.717 9.29329 116.355 10.4668C117.005 11.6403 117.33 12.9733 117.33 14.4658H112.322C112.322 13.3037 112.072 12.4207 111.57 11.8169C111.08 11.2017 110.368 10.894 109.434 10.894C108.557 10.894 107.873 11.1561 107.383 11.6802C106.893 12.1929 106.648 12.8879 106.648 13.7651C106.648 14.4487 106.922 15.0697 107.469 15.6279C108.016 16.1748 108.984 16.7445 110.374 17.3369C112.801 18.2142 114.561 19.2909 115.655 20.5669C116.76 21.8429 117.312 23.4665 117.312 25.4375C117.312 27.6022 116.623 29.2941 115.245 30.5132C113.866 31.7323 111.992 32.3418 109.622 32.3418C108.016 32.3418 106.552 32.0114 105.23 31.3506C103.908 30.6898 102.872 29.7441 102.12 28.5137C101.379 27.2832 101.009 25.8306 101.009 24.1558H106.05C106.05 25.5913 106.329 26.6338 106.888 27.2832C107.446 27.9326 108.357 28.2573 109.622 28.2573C111.377 28.2573 112.254 27.3288 112.254 25.4717ZM136.761 11.3042H130.608V32H125.567V11.3042H119.517V7.11719H136.761V11.3042ZM152.5 21.2334H144.673V27.8301H153.936V32H139.649V7.11719H153.902V11.3042H144.673V17.1831H152.5V21.2334ZM163.404 7.11719L168.104 25.1128L172.786 7.11719H179.349V32H174.307V25.2666L174.769 14.8931L169.795 32H166.377L161.404 14.8931L161.866 25.2666V32H156.841V7.11719H163.404ZM195.584 26.9072H188.731L187.398 32H182.083L189.859 7.11719H194.456L202.283 32H196.917L195.584 26.9072ZM189.825 22.7202H194.473L192.149 13.8506L189.825 22.7202Z" fill="#565656"/>
          <Path d="M74.0879 56V36.8047H79.1636C81.4048 36.8047 83.189 37.5166 84.5161 38.9404C85.8521 40.3643 86.5332 42.3154 86.5596 44.7939V47.9053C86.5596 50.4277 85.8916 52.4097 84.5557 53.8511C83.2285 55.2837 81.396 56 79.0581 56H74.0879ZM77.9639 40.0347V52.7832H79.124C80.416 52.7832 81.3257 52.4448 81.853 51.7681C82.3804 51.0825 82.6572 49.9048 82.6836 48.2349V44.8994C82.6836 43.1064 82.4331 41.8584 81.9321 41.1553C81.4312 40.4434 80.5786 40.0698 79.3745 40.0347H77.9639ZM99.2686 47.6943H93.2305V52.7832H100.376V56H89.3545V36.8047H100.35V40.0347H93.2305V44.5698H99.2686V47.6943ZM118.002 52.0713H112.716L111.688 56H107.587L113.586 36.8047H117.132L123.17 56H119.031L118.002 52.0713ZM113.56 48.8413H117.146L115.353 41.999L113.56 48.8413ZM128.853 52.7832H135.655V56H124.977V36.8047H128.853V52.7832ZM147.323 52.0713H142.036L141.008 56H136.908L142.906 36.8047H146.453L152.491 56H148.351L147.323 52.0713ZM142.88 48.8413H146.466L144.673 41.999L142.88 48.8413ZM160.111 48.9863H158.186V56H154.31V36.8047H160.493C162.436 36.8047 163.934 37.3101 164.989 38.3208C166.052 39.3228 166.584 40.751 166.584 42.6055C166.584 45.1543 165.657 46.9385 163.802 47.958L167.164 55.8154V56H162.998L160.111 48.9863ZM158.186 45.7563H160.388C161.161 45.7563 161.741 45.5015 162.128 44.9917C162.515 44.4731 162.708 43.7832 162.708 42.9219C162.708 40.9971 161.957 40.0347 160.454 40.0347H158.186V45.7563ZM174.31 36.8047L177.935 50.687L181.547 36.8047H186.61V56H182.721V50.8057L183.077 42.8032L179.24 56H176.604L172.767 42.8032L173.123 50.8057V56H169.247V36.8047H174.31ZM199.648 47.6943H193.61V52.7832H200.756V56H189.734V36.8047H200.729V40.0347H193.61V44.5698H199.648V47.6943Z" fill="#EF2A5A"/>
        </Svg>

        <TouchableOpacity
          style={styles.btnLogin}
          activeOpacity={0.75}
          onPress={() => this.signInWithGoogleAsync()}
        >
          <Image
            source={require('../../src/imgs/google.png')}
            style={styles.btnIcone}
          />

          <Text style={styles.btnTexto}>|</Text>

          <Text style={styles.btnTexto}>Entre com sua conta do Google </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
}


const styles = StyleSheet.create({

  container: {
    backgroundColor: '#f4f4f4',
    flex: 1,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },

  btnLogin: {
    backgroundColor: '#f4f4f4',
    width: '100%',
    height: 55,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
	    width: 0,
    	height: 20,
    },
    shadowOpacity: 0.30,
    shadowRadius: 48,
    elevation: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginTop: 45
  },

  btnTexto: {
    color:'#7B7B7B',
    fontSize: 16,
  }

});