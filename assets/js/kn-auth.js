
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ======================================================
// 1. SUPABASE CONFIGURATION
// ======================================================

const SUPABASE_URL =
    "https://jodmltdihoojhhfwaaio.supabase.co";

// Public publishable key only.
// NEVER put your service_role key in frontend JavaScript.
const SUPABASE_PUBLIC_KEY =
    "sb_publishable_xJywoiXcrJfVsrqjUJY3aA_K2o43ALP";

// Automatically uses the URL from which the application
// was opened. Works with localhost, LAN IP and deployed URL.
const AUTH_REDIRECT_URL = new URL(
    window.location.pathname,
    window.location.origin
).href;

const configured =
    SUPABASE_URL.startsWith("https://") &&
    SUPABASE_PUBLIC_KEY.startsWith("sb_publishable_") &&
    !SUPABASE_URL.includes("YOUR_PROJECT_REF");

if (!configured) {
    console.error("Supabase configuration is incomplete.");
}

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            flowType: "pkce"
        }
    }
);

// ======================================================
// 2. GLOBAL VARIABLES
// ======================================================

const app = document.querySelector(".app");

let overlay = null;
let statusEl = null;
let activeUser = null;
let authInitialized = false;


// ======================================================
// 3. STATUS MESSAGE
// ======================================================

function msg(message, type = "") {
    if (!statusEl) return;

    statusEl.textContent = message;

    statusEl.className =
        ("kn-auth-status " + type).trim();
}


// ======================================================
// 4. APPLICATION ACCESS CONTROL
// ======================================================

function gate(showApp) {

    if (app) {
        app.style.visibility = showApp
            ? "visible"
            : "hidden";
    }

    if (overlay) {
        overlay.style.display = showApp
            ? "none"
            : "grid";
    }
}


// ======================================================
// 5. FORM SWITCHING
// ======================================================

function form(which) {

    if (!overlay) return;

    ["login", "signup", "reset"].forEach(name => {

        const element = overlay.querySelector(
            "#kn-" + name + "-form"
        );

        if (element) {
            element.hidden = name !== which;
        }

    });

    const loginTab =
        overlay.querySelector("#kn-login-tab");

    const signupTab =
        overlay.querySelector("#kn-signup-tab");

    if (loginTab && signupTab) {

        loginTab.hidden = which === "reset";
        signupTab.hidden = which === "reset";

        loginTab.classList.toggle(
            "active",
            which === "login"
        );

        signupTab.classList.toggle(
            "active",
            which === "signup"
        );
    }

    msg("");
}


// ======================================================
// 6. LOADING BUTTON
// ======================================================

function setLoading(button, loading, originalText) {

    if (!button) return;

    button.disabled = loading;

    button.textContent = loading
        ? "Please wait..."
        : originalText;
}


// ======================================================
// 7. AUTHENTICATION INTERFACE
// ======================================================

function render() {

    if (overlay) return;

    overlay = document.createElement("div");

    overlay.id = "kn-auth-overlay";

    overlay.innerHTML = `

    <section class="kn-auth-card">

        <div class="kn-auth-brand">

            <span>🌾</span>

            <div>
                <b>KRISHI NEXUS</b>
                <small>Tech Se Kheti Growth</small>
            </div>

        </div>


        <div class="kn-auth-tabs">

            <button
                id="kn-login-tab"
                type="button"
                class="kn-auth-tab active">

                Log in

            </button>


            <button
                id="kn-signup-tab"
                type="button"
                class="kn-auth-tab">

                Create account

            </button>

        </div>


        <!-- LOGIN FORM -->

        <form id="kn-login-form">

            <h2>Welcome back</h2>

            <p>Log in with your verified email.</p>


            <label>Email</label>

            <input
                id="kn-login-email"
                type="email"
                autocomplete="email"
                required
            >


            <label>Password</label>

            <input
                id="kn-login-password"
                type="password"
                autocomplete="current-password"
                required
            >


            <button
                class="kn-auth-primary"
                type="submit">

                Log in

            </button>


            <button
                id="kn-forgot"
                type="button"
                class="kn-auth-link">

                Forgot password?

            </button>


            <button
                id="kn-resend"
                type="button"
                class="kn-auth-link">

                Resend verification email

            </button>

        </form>


        <!-- SIGNUP FORM -->

        <form id="kn-signup-form" hidden>

            <h2>Create account</h2>

            <p>We'll email you a verification link.</p>


            <label>Full name</label>

            <input
                id="kn-name"
                type="text"
                maxlength="100"
                autocomplete="name"
                required
            >


            <label>Email</label>

            <input
                id="kn-email"
                type="email"
                autocomplete="email"
                required
            >


            <label>Password (8+ characters)</label>

            <input
                id="kn-password"
                type="password"
                minlength="8"
                autocomplete="new-password"
                required
            >


            <label>Confirm password</label>

            <input
                id="kn-confirm"
                type="password"
                minlength="8"
                autocomplete="new-password"
                required
            >


            <button
                class="kn-auth-primary"
                type="submit">

                Create account

            </button>

        </form>


        <!-- PASSWORD RESET FORM -->

        <form id="kn-reset-form" hidden>

            <h2>Reset password</h2>

            <p>Choose a new password for your account.</p>


            <label>New password</label>

            <input
                id="kn-new-password"
                type="password"
                minlength="8"
                autocomplete="new-password"
                required
            >


            <label>Confirm password</label>

            <input
                id="kn-new-confirm"
                type="password"
                minlength="8"
                autocomplete="new-password"
                required
            >


            <button
                class="kn-auth-primary"
                type="submit">

                Update password

            </button>


            <button
                id="kn-reset-back"
                type="button"
                class="kn-auth-link">

                Back to login

            </button>

        </form>


        <!-- STATUS MESSAGE -->

        <p
            id="kn-auth-status"
            class="kn-auth-status"
            role="status"
            aria-live="polite">
        </p>


        <small>
            Email verification is required before
            using the app.
        </small>

    </section>

    `;

    document.body.appendChild(overlay);

    statusEl = overlay.querySelector(
        "#kn-auth-status"
    );


    // Tab switching

    overlay.querySelector(
        "#kn-login-tab"
    ).onclick = () => form("login");


    overlay.querySelector(
        "#kn-signup-tab"
    ).onclick = () => form("signup");


    overlay.querySelector(
        "#kn-reset-back"
    ).onclick = () => form("login");


    // ==================================================
    // 8. FORGOT PASSWORD
    // ==================================================

    overlay.querySelector(
        "#kn-forgot"
    ).onclick = async () => {

        const email = overlay.querySelector(
            "#kn-login-email"
        ).value.trim();

        if (!email) {
            return msg(
                "Enter your email address first.",
                "error"
            );
        }

        try {

            const { error } =
                await supabase.auth.resetPasswordForEmail(
                    email,
                    {
                        redirectTo: AUTH_REDIRECT_URL
                    }
                );

            if (error) {
                return msg(error.message, "error");
            }

            msg(
                "If the account exists, a password-reset email has been sent.",
                "success"
            );

        } catch (error) {

            console.error(error);

            msg(
                "Unable to send reset email. Please try again.",
                "error"
            );
        }
    };


    // ==================================================
    // 9. RESEND VERIFICATION EMAIL
    // ==================================================

    overlay.querySelector(
        "#kn-resend"
    ).onclick = async () => {

        const email = overlay.querySelector(
            "#kn-login-email"
        ).value.trim();

        if (!email) {
            return msg(
                "Enter your registered email address first.",
                "error"
            );
        }

        const button = overlay.querySelector(
            "#kn-resend"
        );

        button.disabled = true;

        try {

            const { error } =
                await supabase.auth.resend({

                    type: "signup",

                    email: email,

                    options: {
                        emailRedirectTo: AUTH_REDIRECT_URL
                    }

                });

            if (error) {
                msg(error.message, "error");
            } else {

                msg(
                    "If an unverified account exists, a new verification email has been sent.",
                    "success"
                );

            }

        } catch (error) {

            console.error(error);

            msg(
                "Unable to resend verification email.",
                "error"
            );

        } finally {

            button.disabled = false;

        }
    };


    // ==================================================
    // 10. LOGIN
    // ==================================================

    overlay.querySelector(
        "#kn-login-form"
    ).onsubmit = async e => {

        e.preventDefault();

        const button = e.currentTarget.querySelector(
            '[type="submit"]'
        );

        const originalText = "Log in";

        const email = overlay.querySelector(
            "#kn-login-email"
        ).value.trim();

        const password = overlay.querySelector(
            "#kn-login-password"
        ).value;

        setLoading(button, true, originalText);

        try {

            const { data, error } =
                await supabase.auth.signInWithPassword({

                    email,
                    password

                });

            if (error) {

                return msg(
                    "Login failed. Check your email and password, and ensure your email is verified.",
                    "error"
                );

            }

            if (!data.user?.email_confirmed_at) {

                await supabase.auth.signOut();

                return msg(
                    "Please verify your email before logging in.",
                    "error"
                );

            }

            await activate(data.user);

        } catch (error) {

            console.error(error);

            msg(
                "Something went wrong during login.",
                "error"
            );

        } finally {

            setLoading(button, false, originalText);

        }

    };


    // ==================================================
    // 11. SIGNUP
    // ==================================================

    overlay.querySelector(
        "#kn-signup-form"
    ).onsubmit = async e => {

        e.preventDefault();

        // Keep a stable reference before the first await.
        // Event.currentTarget becomes null after the handler yields.
        const signupForm = e.currentTarget;

        const name = overlay.querySelector(
            "#kn-name"
        ).value.trim();

        const email = overlay.querySelector(
            "#kn-email"
        ).value.trim();

        const password = overlay.querySelector(
            "#kn-password"
        ).value;

        const confirm = overlay.querySelector(
            "#kn-confirm"
        ).value;


        if (!name) {

            return msg(
                "Please enter your full name.",
                "error"
            );

        }


        if (password.length < 8) {

            return msg(
                "Password must contain at least 8 characters.",
                "error"
            );

        }


        if (password !== confirm) {

            return msg(
                "Passwords do not match.",
                "error"
            );

        }


        const button = e.currentTarget.querySelector(
            '[type="submit"]'
        );

        const originalText = "Create account";

        setLoading(button, true, originalText);


        try {

            const { data, error } =
                await supabase.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        emailRedirectTo: AUTH_REDIRECT_URL,

                        data: {
                            full_name: name
                        }

                    }

                });


            if (error) {

                return msg(
                    error.message,
                    "error"
                );

            }


            signupForm.reset();


            // Some Supabase configurations return a
            // session immediately when confirmation is
            // disabled. Only verified users can proceed.

            if (
                data.session &&
                data.user?.email_confirmed_at
            ) {

                await activate(data.user);

                return;

            }


            form("login");


            overlay.querySelector(
                "#kn-login-email"
            ).value = email;


            msg(
                "Account created! Check your email and click the verification link. Then log in.",
                "success"
            );


        } catch (error) {

            console.error(error);

            msg(
                "Unable to create your account. Please try again.",
                "error"
            );

        } finally {

            setLoading(button, false, originalText);

        }

    };


    // ==================================================
    // 12. UPDATE PASSWORD
    // ==================================================

    overlay.querySelector(
        "#kn-reset-form"
    ).onsubmit = async e => {

        e.preventDefault();

        const password = overlay.querySelector(
            "#kn-new-password"
        ).value;

        const confirm = overlay.querySelector(
            "#kn-new-confirm"
        ).value;


        if (password.length < 8) {

            return msg(
                "Password must contain at least 8 characters.",
                "error"
            );

        }


        if (password !== confirm) {

            return msg(
                "Passwords do not match.",
                "error"
            );

        }


        const button = e.currentTarget.querySelector(
            '[type="submit"]'
        );

        const originalText = "Update password";

        setLoading(button, true, originalText);


        try {

            const { error } =
                await supabase.auth.updateUser({

                    password: password

                });


            if (error) {

                return msg(
                    error.message,
                    "error"
                );

            }


            await supabase.auth.signOut();

            activeUser = null;

            form("login");

            msg(
                "Password updated successfully. Please log in with your new password.",
                "success"
            );


        } catch (error) {

            console.error(error);

            msg(
                "Unable to update your password.",
                "error"
            );

        } finally {

            setLoading(button, false, originalText);

        }

    };

}


// ======================================================
// 13. ACTIVATE VERIFIED USER
// ======================================================

async function activate(user) {

    if (!user?.email_confirmed_at) {

        activeUser = null;

        gate(false);

        msg(
            "Verify your email before using Krishi Nexus.",
            "error"
        );

        return;

    }

    activeUser = user;

    gate(true);

    addLogout();

}


// ======================================================
// 14. LOGOUT BUTTON
// ======================================================

function addLogout() {

    const host = document.querySelector(
        ".head-actions"
    );

    if (!host) return;

    if (host.querySelector("#kn-logout")) {
        return;
    }

    const button = document.createElement(
        "button"
    );

    button.id = "kn-logout";

    button.className = "kn-auth-logout";

    button.textContent = "Log out";


    button.onclick = async () => {

        button.disabled = true;

        try {

            const { error } =
                await supabase.auth.signOut();

            if (error) {

                msg(
                    error.message,
                    "error"
                );

                button.disabled = false;

                return;

            }

            activeUser = null;

            location.reload();

        } catch (error) {

            console.error(error);

            msg(
                "Unable to log out. Please try again.",
                "error"
            );

            button.disabled = false;

        }

    };

    host.prepend(button);

}


// ======================================================
// 15. PUBLIC AUTHENTICATION API
// ======================================================

window.KrishiAuth = {

    async getVerifiedUser() {

        const { data, error } =
            await supabase.auth.getUser();

        if (
            error ||
            !data.user?.email_confirmed_at
        ) {

            activeUser = null;

            gate(false);

            msg(
                "Please log in with a verified email before saving a profile.",
                "error"
            );

            return null;

        }

        activeUser = data.user;

        return data.user;

    },


    getCurrentUser() {

        return activeUser;

    },


    async signOut() {

        const { error } =
            await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        activeUser = null;

        gate(false);

    },


    getSupabaseClient() {

        return supabase;

    }

};


// ======================================================
// 16. PASSWORD RECOVERY DETECTION
// ======================================================

function isRecoveryFlow() {

    const hash = new URLSearchParams(
        window.location.hash.substring(1)
    );

    const query = new URLSearchParams(
        window.location.search
    );

    return (
        hash.get("type") === "recovery" ||
        query.get("type") === "recovery"
    );

}


function showResetForm() {

    gate(false);

    form("reset");

    msg(
        "Verification successful. Choose your new password.",
        "success"
    );

}


// ======================================================
// 17. APPLICATION INITIALIZATION
// ======================================================

async function boot() {

    render();

    if (!configured) {

        gate(false);

        msg(
            "Supabase setup is incomplete. Check your project URL and public key.",
            "error"
        );

        return;

    }


    // Listen for authentication events.

    supabase.auth.onAuthStateChange(
        (event, session) => {

            if (event === "PASSWORD_RECOVERY") {

                showResetForm();

                return;

            }


            if (
                event === "SIGNED_OUT" ||
                !session
            ) {

                activeUser = null;

                gate(false);

                return;

            }


            if (session.user?.email_confirmed_at) {

                // Do not await Supabase operations here.
                activate(session.user);

            } else {

                activeUser = null;

                gate(false);

            }

        }
    );


    // Check existing session.

    try {

        const { data, error } =
            await supabase.auth.getSession();


        if (error) {

            console.error(error);

            gate(false);

            msg(
                "Could not check your login session. Please refresh.",
                "error"
            );

            return;

        }


        // Handle password recovery.

        if (isRecoveryFlow()) {

            if (data.session) {

                showResetForm();

            } else {

                gate(false);

                msg(
                    "Your password-reset session could not be verified. Request a new reset email.",
                    "error"
                );

            }

            return;

        }


        // Existing verified user.

        if (
            data.session?.user?.email_confirmed_at
        ) {

            await activate(data.session.user);

        } else {

            activeUser = null;

            gate(false);

        }


        authInitialized = true;

        console.log(
            "Krishi Nexus authentication initialized successfully."
        );


    } catch (error) {

        console.error(
            "Authentication initialization error:",
            error
        );

        gate(false);

        msg(
            "Authentication initialization failed. Check your internet connection and Supabase settings.",
            "error"
        );

    }

}


// ======================================================
// 18. START APPLICATION
// ======================================================

boot().catch(error => {

    console.error(
        "Krishi Nexus startup error:",
        error
    );

    render();

    gate(false);

    msg(
        "Unable to initialize authentication. Please refresh the page.",
        "error"
    );

});
