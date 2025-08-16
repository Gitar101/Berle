async function postToApi() {
  const url = 'https://puc.kumarans.org/api/v2/features/doIhaveAccessToThisFeature';
  const headers = {
    'accept': 'application/json, text/javascript, */*; q=0.01',
    'accept-language': 'en-US,en;q=0.5',
    'authorization': 'JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3ODEyMDAxNzIsImlhdCI6MTc1NTI4MDE3MiwibmJmIjoxNzU1MjgwMTcyLCJpZGVudGl0eSI6ImY4NTk3ZDZmZTY2NzQ1MzU5MDg4MzliYjIwYmVjZjBjIiwicmVmIjoyMTYwMDAwMH0.FZiIEEtx1HuvWwQk3ASHEPGNxHpB9eQO-25sDWGc6C0',
    'content-type': 'application/json',
    'dnt': '1',
    'origin': 'https://puc.kumarans.org',
    'priority': 'u=1, i',
    'referer': 'https://puc.kumarans.org/v2/views/resp/all/home/dashboard/',
    'sec-ch-ua': '"Not;A=Brand";v="99", "Brave";v="139", "Chromium";v="139"',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'sec-gpc': '1',
    'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
  };
  const body = {
    "feature_id": "website_feature",
    "get_constants": "Y",
    "user_role": "parent",
    "user_id": "f8597d6fe6674535908839bb20becf0c",
    "academic_year_id": "222468eeb7c44b5aa3019ec83629df54"
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Call the function to execute the POST request
postToApi();