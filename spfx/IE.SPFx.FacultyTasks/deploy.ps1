./login.ps1


$siteCollections = @(
    "appcatalog"
)


$siteCollections | ForEach-Object {
    $siteCollectionUrl = "$env:RootSite/sites/$_";
    if ($_ -eq "/") {
        $siteCollectionUrl = "$env:RootSite+$env:IEUniversityRoot";
    }
    
    $certPass = ConvertTo-SecureString -AsPlainText $env:CertPass -Force 
    Connect-PnPOnline -Url $siteCollectionUrl -ClientId $env:ClientId -CertificateBase64Encoded $env:CertificateBase64Encoded -Tenant $env:Tenant -CertificatePassword $certPass

    $path = Get-ChildItem -Path .\sharepoint -Filter *.sppkg -Recurse -File -Name
    $filePath = "$PSScriptRoot\sharepoint\$path"
    Add-PnPApp -Path $filePath -Scope Tenant -Overwrite -Publish -SkipFeatureDeployment

    Disconnect-PnPOnline
}
