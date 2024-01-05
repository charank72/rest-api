const reset_password = (name, email, token) => {
  return `<div>
            <main>
              <div>
                <h1>Hello, ${name}, your email id ${email}</h1>
                <p>Follow this link to reset your password</p>
                <p>
                  <strong>
                    <a class="btn" target="_blank" href="http://localhost:3000/password/reset?token=${token}">Reset your password</a>
                  </strong>
                </p>

                <p>if you didn't ask to reset your password,ignore this link</p>

                <h3>Thanks,</h3>
                <h4>Team API</h4>
              </div>
            </main>
          </div>`;
};
module.exports = reset_password;
