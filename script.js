// script.js import { auth, db } from './firebase.js'; import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth'; import { doc, setDoc, getDoc, updateDoc, arrayUnion, collection, getDocs } from 'firebase/firestore';

const loginBtn = document.getElementById('loginBtn'); const registerBtn = document.getElementById('registerBtn'); const logoutBtn = document.getElementById('logoutBtn'); const gachaBtn = document.getElementById('gachaBtn'); const gacha10Btn = document.getElementById('gacha10Btn');

const emailInput = document.getElementById('email'); const passInput = document.getElementById('password'); const loginBox = document.getElementById('login-container'); const gameBox = document.getElementById('game-container'); const usernameDisplay = document.getElementById('usernameDisplay'); const coinsDisplay = document.getElementById('coins'); const resultBox = document.getElementById('result'); const collectionBox = document.getElementById('collection'); const leaderboardBox = document.getElementById('leaderboard');

let currentUser = null; const hadiah = [ { nama: 'Luffy', img: 'https://i.imgur.com/rlcRzGK.png' }, { nama: 'Zoro', img: 'https://i.imgur.com/xX0qAZ3.png' }, { nama: 'Nami', img: 'https://i.imgur.com/6yFNRvq.png' }, { nama: 'Ace', img: 'https://i.imgur.com/UeXctLJ.png' }, { nama: 'Robin', img: 'https://i.imgur.com/DRvpIPV.png' }, { nama: 'Chopper', img: 'https://i.imgur.com/jTzFYSk.png' }, { nama: 'Sanji', img: 'https://i.imgur.com/mKysRbH.png' }, { nama: 'Law', img: 'https://i.imgur.com/qg1nq3h.png' }, { nama: 'Brook', img: 'https://i.imgur.com/q0WQfyq.png' }, { nama: 'Jinbe', img: 'https://i.imgur.com/DlC4aA6.png' } ];

loginBtn.onclick = async () => { const email = emailInput.value; const pass = passInput.value; try { await signInWithEmailAndPassword(auth, email, pass); } catch (e) { alert("Login gagal: " + e.message); } };

registerBtn.onclick = async () => { const email = emailInput.value; const pass = passInput.value; try { const res = await createUserWithEmailAndPassword(auth, email, pass); await setDoc(doc(db, "users", res.user.uid), { email, coins: 10, koleksi: [] }); } catch (e) { alert("Register gagal: " + e.message); } };

logoutBtn.onclick = () => signOut(auth);

onAuthStateChanged(auth, async user => { if (user) { currentUser = user; loginBox.style.display = 'none'; gameBox.style.display = 'block'; usernameDisplay.innerText = user.email; await loadUserData(); loadLeaderboard(); } else { loginBox.style.display = 'block'; gameBox.style.display = 'none'; } });

async function loadUserData() { const snap = await getDoc(doc(db, "users", currentUser.uid)); if (!snap.exists()) return; const data = snap.data(); coinsDisplay.innerText = data.coins; collectionBox.innerHTML = data.koleksi.map(item => <img src="${item.img}" alt="${item.nama}" title="${item.nama}"/>).join(''); }

async function drawGacha(times = 1) { const snap = await getDoc(doc(db, "users", currentUser.uid)); if (!snap.exists()) return; const data = snap.data(); if (data.coins < times) { alert("Koin tidak cukup!"); return; } const hasil = []; for (let i = 0; i < times; i++) { const pick = hadiah[Math.floor(Math.random() * hadiah.length)]; hasil.push(pick); } await updateDoc(doc(db, "users", currentUser.uid), { coins: data.coins - times, koleksi: arrayUnion(...hasil) }); await loadUserData(); showResults(hasil); loadLeaderboard(); }

function showResults(results) { resultBox.innerHTML = results.map(h =>  <div> <strong>${h.nama}</strong><br /> <img src="${h.img}" width="80" /> </div>).join(''); }

gachaBtn.onclick = () => drawGacha(1); gacha10Btn.onclick = () => drawGacha(10);

async function loadLeaderboard() { leaderboardBox.innerHTML = ''; const q = await getDocs(collection(db, "users")); const users = []; q.forEach(docSnap => { const data = docSnap.data(); users.push({ email: data.email, count: (data.koleksi || []).length }); }); users.sort((a, b) => b.count - a.count); users.slice(0, 10).forEach(u => { const li = document.createElement('li'); li.innerText = ${u.email} - ${u.count} item; leaderboardBox.appendChild(li); }); }

