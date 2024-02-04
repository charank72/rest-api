const confirm_temp = (name, email,sub, msg) => {
  return `<div>
            <main>
              <div>
                <h1>Hello, ${name}, your email id ${email}</h1>
                <h2>
                  ${sub}
                </h2>
                <p>
                  <strong>
                      ${msg}
                  </strong>
                </p>

                <p>if you didn't ask to reset your password,ignore this link</p>

                <h3>Thanks,</h3>
                <h4>Team API</h4>
              </div>
            </main>
          </div>`;
};
module.exports = confirm_temp;

