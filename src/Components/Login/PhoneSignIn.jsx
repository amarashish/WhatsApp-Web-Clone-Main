import React, { useContext, useState } from "react";
import { AccountContext } from "../../Context/AccountProvider.jsx";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { addUser } from "../../Service/api";
import { auth } from "./firebase/firebaseAuth";
import { Dialog } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';


const PhoneSingIn = ({ click, setClick }) => {

    const { setAccount } = useContext(AccountContext);

    const [phone, setPhone] = useState("");
    const [user, setUser] = useState("");
    const [otp, setOtp] = useState("");
    const [display, setDisplay] = useState("none");

    const sendOtp = async () => {
        try {
            setDisplay("block");
            const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
            const confirmation = await signInWithPhoneNumber(auth, phone, recaptcha);
            setUser(confirmation);
        } catch (error) {
            console.log(error.message);
        }
    }

    const verifyOtp = async () => {
        try {
            await user.confirm(otp);

            const userInfo = {
                sub: phone,
                name: phone,
                picture: "https://i.postimg.cc/vmVXqpdj/blank-profile-picture-wp.png",
                email: "",
                about: "Write something about yourself",
                phone: phone
            }
            const userFound = await addUser(userInfo);
            if (userFound) {
                setAccount(userFound.data);
            } else {
                setAccount(userInfo);
            }
        } catch (error) {
            console.log("Could not verfity Otp ", error.message);
        }
    }
    return (
        <Dialog
            className="login-with-phone-window"
            open={click}
        >
            <CloseIcon onClick={()=> setClick(false)} style={{ alignSelf: "end", margin: "15px 20px 0 0", cursor:"pointer" }} />
            <div className="otp-send-verify-window">
                <div
                    style={{ display: "flex" }}>
                    <div>
                        <PhoneInput style={{ margin: "20px" }}
                            country={"in"}
                            value={phone}
                            onChange={(phone) => setPhone("+" + phone)}
                        />
                    </div>
                    <div>
                        <button onClick={sendOtp} className="send-verify-otp-btn">Send OTP</button>
                    </div>
                </div>
                <div style={{ marginLeft: "20px", display: "flex" }}>
                    <div id="recaptcha" />
                    <div style={{ display: display, padding: "18px 8px", marginLeft: "20px", width: "100px", textAlign: "center", color: "red", borderRadius: "5px" }}><span>Verfity captcha to get otp</span></div>
                </div>
                <div style={{ display: "flex" }}>
                    <input onChange={(e) => setOtp(e.target.value)} type="text" placeholder="Enter Otp" className="enter-phone-otp-field" />
                    <button onClick={verifyOtp} className="send-verify-otp-btn">Verify Otp</button>
                </div>
            </div>
        </Dialog>
    )
}
export default PhoneSingIn;