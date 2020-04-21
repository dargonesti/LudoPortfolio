Public Sub createT4andRL1()
Rem
Rem (C) Copyright 2014 Intuit Canada ULC
Rem www.accountant.intuit.ca
Rem
Rem If you want to override a field you can use the following
Rem FXClient.FieldAttribute("T4DTable.S[" + Str$(CellCount) + ",8]") = ofaOverride
Rem Set up our variables to access Profile
Dim Transfer As Boolean
Dim FXModule As profile.IProfileModule
Dim FXFileObj As profile.IProfileFile
Dim FXClient As profile.IProfileClient
Dim bString As String
Dim fd As FileDialog
Dim FileExt As String

Dim ModuleStr As String

ModuleStr = GetCurrentYearModuleString("FX")

Rem Load the Current FX Module
' The above GetCurrentYearModuleString call will resolve to a string with the identifier for the most recent module (eg. "2014T1")
' If you wanted to use a specific year of a module you could just use the appropriate string:
'  Example: Set T1Module = CreateObject("Profile.T2014T1Module")
Set FXModule = CreateObject("Profile.T" & ModuleStr & "Module")
Rem Create a new Current FX File
Set FXFileObj = CreateObject("Profile.T" & ModuleStr & "File")
Rem Get the client object of the file
Set FXClient = FXFileObj.Client

Rem ******************************************************
Rem First, set up the company information on the Summary form
Rem Employer BN
bString = Mid(Worksheets(1).Cells(3, 3), 1, 9)
bString = bString + Mid(Worksheets(1).Cells(3, 3), 11, 15)
FXClient.Field("FXInfo.s[4]") = bString

Rem Employer name
FXClient.Field("FXInfo.s[5]") = Worksheets(1).Cells(4, 3).Value
Rem Employer name 2
FXClient.Field("FXInfo.s[6]") = Worksheets(1).Cells(5, 3).Value
Rem Employer address line 1
FXClient.Field("FXInfo.s[10]") = Worksheets(1).Cells(6, 3).Value
Rem Employer address line 2
FXClient.Field("FXInfo.s[11]") = Worksheets(1).Cells(7, 3).Value
Rem Employer City
FXClient.Field("FXInfo.s[12]") = Worksheets(1).Cells(8, 3).Value
Rem Employer province
FXClient.Field("FXInfo.s[13]") = Worksheets(1).Cells(9, 3).Value
Rem Employer postal code
FXClient.Field("FXInfo.s[14]") = Worksheets(1).Cells(10, 3).Value
Rem Employer country
FXClient.Field("FXInfo.s[15]") = Worksheets(1).Cells(11, 3).Value
Rem remittances
FXClient.Field("FXInfo.R[10]") = Worksheets(1).Cells(12, 3).Value
Rem amount enclosed
FXClient.Field("T4S.R[15]") = Worksheets(1).Cells(13, 3).Value
Rem SIN of propietor
FXClient.Field("FXInfo.S[48]") = Worksheets(1).Cells(14, 3).Value
FXClient.Field("FXInfo.S[51]") = Worksheets(1).Cells(15, 3).Value
Rem Contact person
FXClient.Field("FXInfo.s[26]") = Worksheets(1).Cells(16, 3).Value
FXClient.Field("FXInfo.s[27]") = Worksheets(1).Cells(17, 3).Value
Rem Contact person position
FXClient.Field("FXInfo.s[28]") = Worksheets(1).Cells(18, 3).Value
Rem Telephone number
FXClient.Field("FXInfo.s[31]") = Worksheets(1).Cells(19, 3).Value
Rem extension
FXClient.Field("FXInfo.s[50]") = Worksheets(1).Cells(20, 3).Value

' rem province of employment
TempInt = 0
temp = ""
temp = UCase(Worksheets(1).Cells(21, 3))
Select Case temp
Case "BC"
  TempInt = 1
Case "AB"
  TempInt = 2
Case "SK"
  TempInt = 3
Case "MB"
  TempInt = 4
Case "ON"
  TempInt = 5
Case "QC"
  TempInt = 6
Case "NB"
  TempInt = 7
Case "NS"
  TempInt = 8
Case "PE"
  TempInt = 9
Case "NL"
  TempInt = 10
Case "YT"
  TempInt = 11
Case "NT"
  TempInt = 12
Case "NU"
  TempInt = 13
End Select
FXClient.Field("FXInfo.B[0]") = TempInt

FXClient.Field("FXInfo.B [6]") = 1
FXClient.FieldAttribute("FXInfo.B [6]") = ofaOverride


Rem Quebec jurisdiction?
If Worksheets(1).CheckBox1.Value = True Then
  FXClient.Field("FXInfo.B[0]") = 6
  Rem MRQ Number
  FXClient.Field("FXInfo.s[69]") = Worksheets(1).Cells(23, 3).Value
  Rem Wages subject to compensation tax
  FXClient.Field("RL1S.R[10]") = Worksheets(1).Cells(24, 3).Value
  Rem Training expenditure balance
  FXClient.Field("RL1S.R[38]") = Worksheets(1).Cells(25, 3).Value
  Rem Current year training
  FXClient.Field("RL1S.R[39]") = Worksheets(1).Cells(26, 3).Value
  Rem Total payroll
  FXClient.Field("RL1S.R[43]") = Round(Worksheets(1).Cells(27, 3), 2)
End If
  

Rem now to do the slips
rwCount = 30 ' Employee info starts on row 30
CellCount = 0 ' In Profile we start at cell 0
FXClient.TableItemCount("T4DTable", 0) = rwCount - 29
FXClient.TableItemCount("RL1DTable", 0) = rwCount - 29
Do While (Trim$(Worksheets(1).Cells(rwCount, 1)) <> "") Or (Trim$(Worksheets(1).Cells(rwCount, 3)) <> "")

  Rem SIN
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",8]") = Worksheets(1).Cells(rwCount, 1).Value
  Rem Employee number
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",9]") = Worksheets(1).Cells(rwCount, 2).Value
  Rem Surname
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",1]") = Worksheets(1).Cells(rwCount, 3).Value
  Rem Firstname
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",2]") = Worksheets(1).Cells(rwCount, 4).Value
  Rem Initial
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",3]") = Worksheets(1).Cells(rwCount, 5).Value
  Rem Address line 1
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",4]") = Worksheets(1).Cells(rwCount, 6).Value
  Rem address line 2
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",5]") = Worksheets(1).Cells(rwCount, 7).Value
  Rem City
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",15]") = Worksheets(1).Cells(rwCount, 8).Value
  Rem Province
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",16]") = UCase(Worksheets(1).Cells(rwCount, 9))
  Rem Postal code
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",7]") = Worksheets(1).Cells(rwCount, 11).Value
  Rem Country
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",6]") = Worksheets(1).Cells(rwCount, 10).Value
  Rem Province of employment
  FXClient.Calculate
  
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",10]") = Worksheets(1).Cells(rwCount, 13).Value
  If FXClient.Field("FXINfo.S[" + "46]") <> FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",10]") Then
    FXClient.FieldAttribute("T4DTable.S[" + Str$(CellCount) + ",10]") = ofaOverride
  End If
  Rem Employment code
  FXClient.Field("T4DTable.S[" + Str$(CellCount) + ",11]") = Worksheets(1).Cells(rwCount, 14).Value
  Rem Exempt EI
  If Worksheets(1).Cells(rwCount, 16) = "X" Then
    FXClient.Field("T4DTable.B[" + Str$(CellCount) + ",2]") = 1
  Else
    FXClient.Field("T4DTable.B[" + Str$(CellCount) + ",2]") = 0
  End If
  Rem Exemption CPP/QPP
  If Worksheets(1).Cells(rwCount, 17) = "X" Then
    FXClient.Field("T4DTable.B[" + Str$(CellCount) + ",3]") = 1
  Else
    FXClient.Field("T4DTable.B[" + Str$(CellCount) + ",3]") = 0
  End If
  Rem Employment income
  If Worksheets(1).Cells(rwCount, 18) <> "" Then
    FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",1]") = Worksheets(1).Cells(rwCount, 18).Value
  End If
  Rem CPP contr
  If Worksheets(1).Cells(rwCount, 19) <> "" Then
    FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",2]") = Worksheets(1).Cells(rwCount, 19).Value
  End If
    Rem EI contr
  If Worksheets(1).Cells(rwCount, 20) <> "" Then
    FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",4]") = Worksheets(1).Cells(rwCount, 20).Value
  End If
    Rem Tax contibution
  If Worksheets(1).Cells(rwCount, 21) <> "" Then
    FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",7]") = Worksheets(1).Cells(rwCount, 21).Value
  End If
    Rem EI Ins. Earning
  If Worksheets(1).Cells(rwCount, 22) <> "" Then
    FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",8]") = Worksheets(1).Cells(rwCount, 22).Value
  End If
    Rem CPP Ins. Earn.
  If Worksheets(1).Cells(rwCount, 23) <> "" Then
    FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",9]") = Worksheets(1).Cells(rwCount, 23).Value
  End If
    Rem Box 40 - Other Taxable Benefits
  If Worksheets(1).Cells(rwCount, 24) <> "" Then
    FXClient.Field("T4DTable.B[" + Str$(CellCount) + ",5]") = "40"
    FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",13]") = Worksheets(1).Cells(rwCount, 24).Value
    Rem Box 42 - Commissions
  End If
  If Worksheets(1).Cells(rwCount, 25) <> "" Then
    If Worksheets(1).Cells(rwCount, 24) = "" Then
      FXClient.Field("T4DTable.B[" + Str$(CellCount) + ",5]") = "42"
      FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",13]") = Worksheets(1).Cells(rwCount, 25).Value
    Else
      FXClient.Field("T4DTable.B[" + Str$(CellCount) + ",6]") = "42"
      FXClient.Field("T4DTable.R[" + Str$(CellCount) + ",14]") = Worksheets(1).Cells(rwCount, 25).Value
    End If
  End If
        
  rwCount = rwCount + 1
  CellCount = CellCount + 1
Loop

'Create a FileDialog object as a File Save As dialog box.
Set fd = Application.FileDialog(msoFileDialogSaveAs)

With fd
  .AllowMultiSelect = False
  .InitialFileName = ""

FileExt = FXModule.FileExtension

filesavename = Application.GetSaveAsFilename("", _
    fileFilter:="Profile FX Files (*" + FileExt + "), *" + FileExt)

FXFileObj.SaveFile filesavename
End With

Set FXModule = Nothing
Set FXFileObj = Nothing
Set FXClient = Nothing
End Sub


