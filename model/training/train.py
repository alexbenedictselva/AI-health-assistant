import os
import pandas as pd
import numpy as np
import joblib

from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from imblearn.over_sampling import SMOTE
import xgboost as xgb


# ------------------------------------------------
# 1️⃣ Load Dataset
# ------------------------------------------------
DATA_PATH = os.path.join("training", "dataset", "diabetics.csv")
df = pd.read_csv(DATA_PATH)


# ------------------------------------------------
# 2️⃣ Create Target Variable
# ------------------------------------------------
df["ComplicationRisk"] = (
    (df["HeartDiseaseorAttack"] == 1) |
    (df["Stroke"] == 1)
).astype(int)

# Remove leakage columns
df = df.drop(["HeartDiseaseorAttack", "Stroke"], axis=1)


# ------------------------------------------------
# 3️⃣ Define Features and Target
# ------------------------------------------------
X = df.drop("ComplicationRisk", axis=1)
y = df["ComplicationRisk"]

print("Training columns:")
print(X.columns)


# ------------------------------------------------
# 4️⃣ Train-Test Split
# ------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# ------------------------------------------------
# 5️⃣ Handle Class Imbalance (SMOTE)
# ------------------------------------------------
sm = SMOTE(random_state=42)
X_train_res, y_train_res = sm.fit_resample(X_train, y_train)


# ------------------------------------------------
# 6️⃣ Define Base Models
# ------------------------------------------------
log_model = LogisticRegression(max_iter=2000)

rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=6,
    random_state=42
)

xgb_model = xgb.XGBClassifier(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42,
    eval_metric="logloss"
)


# ------------------------------------------------
# 7️⃣ Create Stacking Classifier
# ------------------------------------------------
stack_model = StackingClassifier(
    estimators=[
        ('lr', log_model),
        ('rf', rf_model),
        ('xgb', xgb_model)
    ],
    final_estimator=LogisticRegression(),
    cv=5,  # cross-validation for meta model
    n_jobs=-1
)


# ------------------------------------------------
# 8️⃣ Train Stacking Model
# ------------------------------------------------
stack_model.fit(X_train_res, y_train_res)


# ------------------------------------------------
# 9️⃣ Evaluate Model
# ------------------------------------------------
y_probs = stack_model.predict_proba(X_test)[:, 1]

threshold = 0.35
y_pred = (y_probs > threshold).astype(int)

print("\nClassification Report (Threshold =", threshold, ")")
print(classification_report(y_test, y_pred))

roc = roc_auc_score(y_test, y_probs)
print("ROC-AUC Score:", roc)


# ------------------------------------------------
# 🔟 Save Model
# ------------------------------------------------
MODEL_PATH = os.path.join("app", "models", "trained_model.pkl")
joblib.dump(stack_model, MODEL_PATH)

print("\nStacking model training complete and saved.")
