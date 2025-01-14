SELECT
  tmp.ipAddress,

  -- Calculate how many connections are being held by this IP address.
  COUNT( * ) AS numConnections,

  -- For each connection, the TIME column represent how many SECONDS it has been in
  -- its current state. Running some aggregates will give us a fuzzy picture of what
  -- the connections from this IP address is doing.
  FLOOR( AVG( tmp.time ) ) AS timeAVG,
  MAX( tmp.time ) AS timeMAX
FROM
  -- Create an intermediary table that includes an additional column representing
  -- the client IP address without the port.
  (

    SELECT
      -- We don't actually need all of these columns but, including them here to
      -- demonstrate what fields COULD be used in the processlist system.
      pl.id,
      pl.user,
      pl.host,
      pl.db,
      pl.command,
      pl.time,
      pl.state,
      pl.info,

      -- The host column is in the format of "IP:PORT". We want to strip off
      -- the port number so that we can group the results by the IP alone.
      LEFT( pl.host, ( LOCATE( ':', pl.host ) - 1 ) ) AS ipAddress
    FROM
      INFORMATION_SCHEMA.PROCESSLIST pl
  ) AS tmp
GROUP BY tmp.ipAddress
ORDER BY numConnections DESC;