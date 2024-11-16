# Test Authentication Endpoints
$baseUrl = "http://localhost:1337/api"
$headers = @{
    "Content-Type" = "application/json"
}

Write-Host "`n🔑 Testing Authentication Endpoints`n" -ForegroundColor Cyan

# 1. Try login with invalid token
Write-Host "1. Testing Login with Invalid Token..." -ForegroundColor Yellow
$loginData = @{
    accessToken = "invalid_token"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -Headers $headers
    Write-Host "❌ Expected failure but got success" -ForegroundColor Red
} catch {
    Write-Host "✅ Got expected error: Invalid access token" -ForegroundColor Green
}

# 2. Try login with valid token (you need to replace this with a real token)
Write-Host "`n2. Testing Login with Valid Token..." -ForegroundColor Yellow
$loginData = @{
    accessToken = "YOUR_VALID_TOKEN_HERE" # Replace this with a real token from your database
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method Post -Body $loginData -Headers $headers
    Write-Host "✅ Login successful" -ForegroundColor Green
    Write-Host "JWT Token: $($response.token)" -ForegroundColor Gray
    Write-Host "Role: $($response.role.type)" -ForegroundColor Gray
    Write-Host "Customer: $($response.customer.name)" -ForegroundColor Gray

    # Store token for next tests
    $jwt = $response.token
    $authHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer $jwt"
    }

    # 3. Verify token
    Write-Host "`n3. Testing Token Verification..." -ForegroundColor Yellow
    $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/auth/verify" -Method Get -Headers $authHeaders
    Write-Host "✅ Token verification successful" -ForegroundColor Green
    Write-Host "Role: $($verifyResponse.role.type)" -ForegroundColor Gray
    Write-Host "Customer: $($verifyResponse.customer.name)" -ForegroundColor Gray

    # 4. Test logout
    Write-Host "`n4. Testing Logout..." -ForegroundColor Yellow
    $logoutResponse = Invoke-RestMethod -Uri "$baseUrl/auth/logout" -Method Post -Headers $authHeaders
    Write-Host "✅ Logout successful" -ForegroundColor Green

    # 5. Verify token is invalid after logout
    Write-Host "`n5. Testing Token After Logout..." -ForegroundColor Yellow
    try {
        $verifyResponse = Invoke-RestMethod -Uri "$baseUrl/auth/verify" -Method Get -Headers $authHeaders
        Write-Host "❌ Expected failure but token is still valid" -ForegroundColor Red
    } catch {
        Write-Host "✅ Token correctly invalidated" -ForegroundColor Green
    }

} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host "`n✨ Auth Testing Complete`n" -ForegroundColor Cyan
