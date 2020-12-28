import ping from 'net-ping';

var session = ping.createSession ();

const target = '127.0.0.1';

session.pingHost (target, function (error, target) {
    if (error)
        console.log (target + ": " + error.toString ());
    else
        console.log (target + ": Alive");
});